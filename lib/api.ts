import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

// Base API URL - reads from env variable or defaults to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const USERNAME_COOKIE_KEY = 'username';

function setStoredUsername(username: string) {
  Cookies.set(USERNAME_COOKIE_KEY, username, { expires: 7 });
}

function getStoredUsername(): string | undefined {
  return Cookies.get(USERNAME_COOKIE_KEY);
}

function clearAuthCookies() {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  Cookies.remove(USERNAME_COOKIE_KEY);
  delete api.defaults.headers.common.Authorization;
}

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
    if (token) {
      config.headers = config.headers ?? {};
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

        api.defaults.headers.common.Authorization = `Bearer ${access}`;
        
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
        clearAuthCookies();
        
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
  id?: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
}

export interface UserProfileNested {
  id: number;
  bio?: string;
  height_cm?: number | null;
  weight_kg?: number | null;
  profile_picture?: string | null;
  user: User;
  followers: User[];
}

async function ensureUserProfileExists(username: string): Promise<void> {
  // Some backends require explicitly creating a profile resource.
  // If it's already created, the POST may 400/409; we intentionally ignore those.
  try {
    await api.post(
      `/api/users/profile/${encodeURIComponent(username)}/`,
      {},
      {
        validateStatus: (status) => status >= 200 && status < 500,
      }
    );
  } catch {
    // Ignore errors
  }
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
export async function login(data: LoginData): Promise<{ tokens: AuthTokens; user: User | null }> {
  const response = await api.post<AuthTokens>('/api/users/login/', data);
  
  if (response.data.access && response.data.refresh) {
    Cookies.set('access_token', response.data.access, { expires: 1 });
    Cookies.set('refresh_token', response.data.refresh, { expires: 7 });
    setStoredUsername(data.username);

    api.defaults.headers.common.Authorization = `Bearer ${response.data.access}`;
    
    // Fetch user profile immediately after login
    try {
      const user = await getCurrentUser();
      return { tokens: response.data, user };
    } catch (err) {
      // Some backends don't auto-create a profile row on register.
      // If profile doesn't exist yet (404), still treat login as successful.
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        await ensureUserProfileExists(data.username);
        const user = await getCurrentUser();
        return { tokens: response.data, user };
      }
      throw err;
    }
  }
  
  throw new Error('Invalid response from login server');
}

// Logout
export async function logout(): Promise<void> {
  // Your schema doesn't show a logout endpoint, so we just clear cookies
  clearAuthCookies();
}

// Get Profile: GET /api/users/profile/
export async function getCurrentUser(): Promise<User | null> {
  const username = getStoredUsername();
  if (!username) {
    // We have a token but don't know what user to query.
    return null;
  }

  const response = await api.get<UserProfileNested>(
    `/api/users/profile/${encodeURIComponent(username)}/`,
    {
      // A missing profile is normal if the backend doesn't auto-create it.
      // Keep 401 as a rejected response so the refresh-token interceptor can run.
      validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
    }
  );

  if (response.status === 404) {
    await ensureUserProfileExists(username);
    const retry = await api.get<UserProfileNested>(
      `/api/users/profile/${encodeURIComponent(username)}/`
    );
    return retry.data.user;
  }
  return response.data.user;
}

// // Example: Protected API call
// export async function getProtectedData() {
//   const response = await api.get('/api/protected-endpoint/');
//   return response.data;
// }

// // Export the axios instance for other modules
// export default api;