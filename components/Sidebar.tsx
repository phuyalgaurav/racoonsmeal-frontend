'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/auth-context';

export default function Sidebar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  if (!isAuthenticated) return null;

  const navItems = [
    { label: 'Feed', href: '/', icon: '🏠' },
    { label: 'My Meals', href: '/my-meals', icon: '🍳' },
    { label: 'My Profile', href: '/profile', icon: '👤' },
  ];

  const getInitials = () => {
    if (!user?.username) return 'C';
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <>
      <aside className="fixed left-0 top-0 h-full w-64 bg-sidebar flex flex-col z-40 border-r-4 border-main/20">
        {/* Logo Area */}
        <div className="p-6">
          <Link href="/" className="block">
            <h1 className="text-3xl font-header text-white drop-shadow-md">
              Racoons<br/>
              <span className="text-white/80">meal</span>
            </h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 font-header font-bold text-lg
                  ${isActive 
                    ? 'bg-white text-sidebar shadow-md transform translate-x-2' 
                    : 'text-blue-light hover:bg-white/10 hover:text-white hover:translate-x-1'}
                `}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-white/10 relative">
          <button 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-card border-2 border-main flex items-center justify-center font-header font-bold text-main">
              {getInitials()}
            </div>
            <div className="text-left overflow-hidden">
                <p className="text-white font-header font-bold truncate">{user?.username || 'Chef'}</p>
                <p className="text-blue-light text-xs font-body">View Menu</p>
            </div>
          </button>

          {/* User Menu Dropdown (Card) */}
          {userMenuOpen && (
             <>
                {/* Click outside closer overlay (transparent) */}
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                
                <div className="absolute bottom-20 left-4 w-56 bg-card border-[3px] border-main rounded-2xl shadow-xl z-50 p-2 animate-in slide-in-from-bottom-2">
                    <div className="p-2 border-b-2 border-main/10 mb-2">
                        <p className="text-main font-header font-bold">Chef options</p>
                    </div>
                    <Link 
                        href="/profile"
                        className="block px-4 py-2 text-main font-bold font-body hover:bg-sidebar/10 rounded-lg transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                    >
                        Your Profile
                    </Link>
                    <Link 
                        href="/settings"
                        className="block px-4 py-2 text-main font-bold font-body hover:bg-sidebar/10 rounded-lg transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                    >
                        Settings
                    </Link>
                    <div className="h-px bg-main/10 my-2" />
                    <button
                        onClick={() => {
                            setUserMenuOpen(false);
                            logout();
                        }}
                        className="w-full text-left px-4 py-2 text-red font-bold font-body hover:bg-red/10 rounded-lg transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
             </>
          )}
        </div>
      </aside>
    </>
  );
}
