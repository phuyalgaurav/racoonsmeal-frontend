'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/auth-context';

export default function TopBar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { label: 'Feed', href: '/' },
    { label: 'My Meals', href: '/my-meals' }, // Assuming route
    { label: 'My Profile', href: '/profile' }, // Assuming route
  ];

  if (!isAuthenticated) {
    return null; // Or return a public topbar variation
  }

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.username) return 'U';
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <nav className="bg-cozy-blue sticky top-0 z-50 border-b-4 border-cozy-blue-light shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18"> {/* Increased height for chunkiness */}
          <div className="flex">
            {/* Logo */}
            <div className="shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-black text-white tracking-wide drop-shadow-sm font-cozy-head hover:scale-105 transition-transform">
                Racoons<span className="text-cozy-red">meal</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4 items-center">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-link px-4 py-2 text-base ${
                      isActive
                        ? 'bg-cozy-blue-light text-cozy-blue cursor-default'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {/* Profile Dropdown */}
            <div className="ml-3 relative" ref={dropdownRef}>
              <div>
                <button
                  type="button"
                  className="bg-transparent flex text-sm rounded-full focus:outline-none items-center gap-3 group"
                  id="user-menu-button"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <span className="text-white font-bold hidden md:block font-cozy-head text-lg group-hover:text-cozy-red transition-colors">
                    {user?.username}
                  </span>
                  <div className="h-10 w-10 rounded-xl bg-white text-cozy-blue flex items-center justify-center font-black shadow-sm border-2 border-transparent group-hover:border-cozy-red transition-all transform group-hover:rotate-3">
                    {getInitials()}
                  </div>
                  {/* Chevron Down Icon */}
                  <svg 
                    className={`h-5 w-5 text-white/70 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-3 w-56 rounded-2xl shadow-xl py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none border-4 border-cozy-blue-light"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-3 text-base text-cozy-brown font-bold hover:bg-cozy-bg mx-2 rounded-xl transition-colors font-cozy-head"
                    role="menuitem"
                    tabIndex={-1}
                    onClick={() => setDropdownOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-3 text-base text-cozy-brown font-bold hover:bg-cozy-bg mx-2 rounded-xl transition-colors font-cozy-head"
                    role="menuitem"
                    tabIndex={-1}
                    onClick={() => setDropdownOpen(false)}
                  >
                    Settings
                  </Link>
                  <div className="h-0.5 bg-gray-100 my-1 mx-4"></div>
                  <button
                    onClick={() => {
                        setDropdownOpen(false);
                        logout();
                    }}
                    className="block w-full text-left px-4 py-3 text-base text-cozy-red-dark hover:bg-red-50 mx-2 rounded-xl font-black transition-colors font-cozy-head"
                    role="menuitem"
                    tabIndex={-1}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="bg-transparent inline-flex items-center justify-center p-2 rounded-xl text-white hover:text-white hover:bg-white/10 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              {!mobileMenuOpen ? (
                <svg className="block h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                /* Icon when menu is open */
                <svg className="block h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-cozy-blue border-t-2 border-white/10" id="mobile-menu">
            <div className="pt-3 pb-4 space-y-2 px-3">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-4 py-3 text-lg font-bold rounded-xl transition-all ${
                                isActive
                                    ? 'bg-white text-cozy-blue shadow-sm'
                                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {item.label}
                        </Link>
                    )
                })}
            </div>
            {/* Mobile User Menu */}
            <div className="pt-4 pb-6 border-t-2 border-white/10 bg-cozy-blue-denim/50">
                <div className="flex items-center px-5">
                    <div className="shrink-0">
                        <div className="h-12 w-12 rounded-xl bg-white text-cozy-blue flex items-center justify-center font-black text-xl shadow-md">
                            {getInitials()}
                        </div>
                    </div>
                    <div className="ml-3">
                        <div className="text-lg font-black text-white">{user?.username}</div>
                    </div>
                </div>
                <div className="mt-4 space-y-2 px-3">
                    <Link
                        href="/profile"
                        className="block px-4 py-3 text-base font-bold text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Your Profile
                    </Link>
                    <Link
                        href="/settings"
                        className="block px-4 py-3 text-base font-bold text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Settings
                    </Link>
                    <button
                        onClick={() => {
                            setMobileMenuOpen(false);
                            logout();
                        }}
                        className="block w-full text-left px-4 py-3 text-base font-bold text-cozy-red hover:text-white hover:bg-cozy-red rounded-xl transition-colors"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </div>
      )}
    </nav>
  );
}
