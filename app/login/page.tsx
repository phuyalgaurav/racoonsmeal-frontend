'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import { AxiosError } from 'axios';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ username, password });
      router.push('/');
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data;
        if (data.detail) {
          setError(data.detail);
        } else {
          setError('Invalid credentials');
        }
      } else {
        setError('Login failed. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="card-panel w-full max-w-md p-8 space-y-8 bg-white/90 backdrop-blur-sm">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-fl-brown tracking-tight">
            Kitchen Login
          </h2>
          <p className="text-fl-brown/70 font-medium">
            Welcome back, Chef!
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-fl-brown mb-1 ml-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-xl border-2 border-[#D7CCC8] bg-[#FAFAFA] px-4 py-3 text-fl-brown placeholder-[#A1887F] focus:border-fl-blue focus:outline-none focus:ring-4 focus:ring-fl-blue/20 transition-all font-medium"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-fl-brown mb-1 ml-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border-2 border-[#D7CCC8] bg-[#FAFAFA] px-4 py-3 text-fl-brown placeholder-[#A1887F] focus:border-fl-blue focus:outline-none focus:ring-4 focus:ring-fl-blue/20 transition-all font-medium"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-chunky w-full flex justify-center py-3 px-4 rounded-xl text-lg font-bold text-white bg-fl-blue hover:bg-fl-blue-dark focus:outline-none focus:ring-4 focus:ring-fl-blue/30 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ '--color-shadow': '#4A89DC' } as React.CSSProperties}
            >
              {isLoading ? 'Opening Kitchen...' : 'Enter Kitchen'}
            </button>
          </div>

          <div className="text-center text-sm font-medium">
            <span className="text-fl-brown/70">
              New here?{' '}
            </span>
            <Link
              href="/register"
              className="font-bold text-fl-green hover:text-[#7CB342] hover:underline"
            >
              Start Cooking (Sign up)
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
