import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

// Base API URL - reads from env variable or defaults to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: sends cookies with requests
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
// Queue to store failed requests while refreshing token
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

// Process all queued requests after token refresh
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// REQUEST INTERCEPTOR: Add access token to every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: Handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response, // Just return successful responses
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = Cookies.get('refresh_token');

      if (!refreshToken) {
        // No refresh token, user needs to login again
        processQueue(error, null);
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh the access token
        const response = await axios.post(`${API_URL}/api/users/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        
        // Save new access token
        Cookies.set('access_token', access, { expires: 1 }); // 1 day
        
        // Update authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }

        // Process all queued requests with new token
        processQueue(null, access);
        isRefreshing = false;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        processQueue(refreshError, null);
        isRefreshing = false;
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        
        // Redirect to login (you can customize this)
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ==================== AUTH API FUNCTIONS ====================

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface User {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

// Register: POST /api/users/register/
export async function register(data: RegisterData) {
  const response = await api.post('/api/users/register/', data);
  return response.data;
}

// Login: POST /api/users/login/
// Note: This only returns tokens, so we fetch the user profile immediately after
export async function login(data: LoginData): Promise<{ tokens: AuthTokens; user: User }> {
  const response = await api.post<AuthTokens>('/api/users/login/', data);
  
  if (response.data.access && response.data.refresh) {
    Cookies.set('access_token', response.data.access, { expires: 1 });
    Cookies.set('refresh_token', response.data.refresh, { expires: 7 });
    
    // Fetch user profile immediately after login
    const user = await getCurrentUser();
    return { tokens: response.data, user };
  }
  
  throw new Error('Invalid response from login server');
}

// Logout
export async function logout(): Promise<void> {
  // Your schema doesn't show a logout endpoint, so we just clear cookies
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
}

// Get Profile: GET /api/users/profile/
export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>('/api/users/profile/');
  return response.data;
}

// // Example: Protected API call
// export async function getProtectedData() {
//   const response = await api.get('/api/protected-endpoint/');
//   return response.data;
// }

// // Export the axios instance for other modules
// export default api;