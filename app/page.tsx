'use client';

import { useAuth } from '../lib/auth-context';
import Link from 'next/link';

export default function Home() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center font-bold text-xl text-fl-brown">
        Loading...
      </div>
    );
  }

  // --- LANDING PAGE (Not Logged In) ---
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="card-panel max-w-2xl w-full p-10 text-center space-y-8 bg-white/90 backdrop-blur-sm">
          <h1 className="text-5xl font-extrabold text-fl-brown mb-2 tracking-tight">Racoonsmeal</h1>
          <p className="text-xl text-fl-brown/80 mb-8 max-w-md mx-auto font-medium">
            Create random meals plans, share meal plans with everyone, track your eating habits !
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="btn-chunky bg-fl-blue hover:bg-fl-blue-dark text-white font-bold py-4 px-8 rounded-2xl text-lg min-w-40"
              style={{ '--color-shadow': '#4A89DC' } as React.CSSProperties}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="btn-chunky bg-fl-green hover:bg-[#7CB342] text-white font-bold py-4 px-8 rounded-2xl text-lg min-w-40"
              style={{ '--color-shadow': '#689F38' } as React.CSSProperties}
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- SIMPLE USER INFO (Logged In) ---
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card-panel max-w-lg w-full p-8 bg-white/95 backdrop-blur-sm text-center">
        <h2 className="text-3xl font-extrabold text-fl-brown mb-6">
           Dashboard
        </h2>
        
        <div className="bg-[#FAF8F5] rounded-xl border-2 border-[#EFEBE9] p-6 mb-8 text-left space-y-3">
           <div className="flex justify-between border-b border-[#EFEBE9] pb-2">
              <span className="font-bold text-fl-brown/60 text-sm">USERNAME</span>
              <span className="font-bold text-fl-brown">{user?.username}</span>
           </div>
           <div className="flex justify-between border-b border-[#EFEBE9] pb-2">
              <span className="font-bold text-fl-brown/60 text-sm">EMAIL</span>
              <span className="font-bold text-fl-brown">{user?.email}</span>
           </div>
           <div className="flex justify-between">
              <span className="font-bold text-fl-brown/60 text-sm">NAME</span>
              <span className="font-bold text-fl-brown">
                {user?.first_name} {user?.last_name}
              </span>
           </div>
        </div>

        <button 
          onClick={logout}
          className="btn-chunky bg-red-400 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-xl text-lg w-full"
          style={{ '--color-shadow': '#D32F2F' } as React.CSSProperties}
        >
          Logout
        </button>  
      </div>
    </div>
  );
}
