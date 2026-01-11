'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import { AxiosError } from 'axios';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
  });
  
  const [error, setError] = useState<Record<string, string[]> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple client-side validation logic
    if (formData.password !== formData.password2) {
      setError({ non_field_errors: ['Passwords do not match'] });
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      router.push('/');
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data) {
        setError(err.response.data);
      } else {
        setError({ non_field_errors: ['Registration failed. Please try again.'] });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to safely get error messages
  const getFieldError = (fieldName: string) => {
    if (!error) return null;
    const fieldError = error[fieldName];
    if (Array.isArray(fieldError) && fieldError.length > 0) {
      return fieldError[0];
    }
    return null;
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 py-8">
      <div className="card-panel w-full max-w-2xl p-8 space-y-8 bg-white/90 backdrop-blur-sm">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-fl-brown tracking-tight">
            New Chef Registration
          </h2>
          <p className="text-fl-brown/70 font-medium">
            Join the kitchen crew!
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error?.non_field_errors && (
             <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error.non_field_errors.join(', ')}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Username */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold text-fl-brown mb-1 ml-1">Username *</label>
              <input
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="block w-full rounded-xl border-2 border-[#D7CCC8] bg-[#FAFAFA] px-4 py-3 text-fl-brown placeholder-[#A1887F] focus:border-fl-blue focus:outline-none focus:ring-4 focus:ring-fl-blue/20 transition-all font-medium"
              />
              {getFieldError('username') && (
                <p className="mt-1 text-sm text-red-600 font-bold">{getFieldError('username')}</p>
              )}
            </div>

            {/* Email */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold text-fl-brown mb-1 ml-1">Email *</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-xl border-2 border-[#D7CCC8] bg-[#FAFAFA] px-4 py-3 text-fl-brown placeholder-[#A1887F] focus:border-fl-blue focus:outline-none focus:ring-4 focus:ring-fl-blue/20 transition-all font-medium"
              />
              {getFieldError('email') && (
                <p className="mt-1 text-sm text-red-600 font-bold">{getFieldError('email')}</p>
              )}
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-bold text-fl-brown mb-1 ml-1">First Name</label>
              <input
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                className="block w-full rounded-xl border-2 border-[#D7CCC8] bg-[#FAFAFA] px-4 py-3 text-fl-brown placeholder-[#A1887F] focus:border-fl-blue focus:outline-none focus:ring-4 focus:ring-fl-blue/20 transition-all font-medium"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-bold text-fl-brown mb-1 ml-1">Last Name</label>
              <input
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                className="block w-full rounded-xl border-2 border-[#D7CCC8] bg-[#FAFAFA] px-4 py-3 text-fl-brown placeholder-[#A1887F] focus:border-fl-blue focus:outline-none focus:ring-4 focus:ring-fl-blue/20 transition-all font-medium"
              />
            </div>

             {/* Date of Birth */}
             <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold text-fl-brown mb-1 ml-1">Date of Birth</label>
              <input
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="block w-full rounded-xl border-2 border-[#D7CCC8] bg-[#FAFAFA] px-4 py-3 text-fl-brown placeholder-[#A1887F] focus:border-fl-blue focus:outline-none focus:ring-4 focus:ring-fl-blue/20 transition-all font-medium appearance-none"
              />
                {getFieldError('date_of_birth') && (
                <p className="mt-1 text-sm text-red-600 font-bold">{getFieldError('date_of_birth')}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-fl-brown mb-1 ml-1">Password *</label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-xl border-2 border-[#D7CCC8] bg-[#FAFAFA] px-4 py-3 text-fl-brown placeholder-[#A1887F] focus:border-fl-blue focus:outline-none focus:ring-4 focus:ring-fl-blue/20 transition-all font-medium"
              />
              {getFieldError('password') && (
                <p className="mt-1 text-sm text-red-600 font-bold">{getFieldError('password')}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-fl-brown mb-1 ml-1">Confirm Password *</label>
              <input
                name="password2"
                type="password"
                required
                value={formData.password2}
                onChange={handleChange}
                className="block w-full rounded-xl border-2 border-[#D7CCC8] bg-[#FAFAFA] px-4 py-3 text-fl-brown placeholder-[#A1887F] focus:border-fl-blue focus:outline-none focus:ring-4 focus:ring-fl-blue/20 transition-all font-medium"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-chunky w-full flex justify-center py-3 px-4 rounded-xl text-lg font-bold text-white bg-fl-green hover:bg-[#7CB342] focus:outline-none focus:ring-4 focus:ring-fl-green/30 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ '--color-shadow': '#689F38' } as React.CSSProperties}
            >
              {isLoading ? 'Hiring Chef...' : 'Complete Registration'}
            </button>
          </div>

          <div className="text-center text-sm font-medium">
            <span className="text-fl-brown/70">
              Already have an apron?{' '}
            </span>
            <Link
              href="/login"
              className="font-bold text-fl-blue hover:text-fl-blue-dark hover:underline"
            >
              Log in instead
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
