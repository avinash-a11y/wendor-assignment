import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../utils';

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Urban Company
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={cn(
                'text-sm font-medium transition-colors duration-200',
                isActive('/') || isActive('/booking')
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-900'
              )}
            >
              Book Service
            </Link>
            <Link
              to="/my-bookings"
              className={cn(
                'text-sm font-medium transition-colors duration-200',
                isActive('/my-bookings')
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-900'
              )}
            >
              My Bookings
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
