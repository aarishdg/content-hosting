import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpenIcon, MicrophoneIcon, UserIcon } from '@heroicons/react/24/outline';
import { cn } from '../../utils/helpers';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <BookOpenIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ContentHub</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary-600',
                isActive('/') ? 'text-primary-600' : 'text-gray-700'
              )}
            >
              Home
            </Link>
            <Link
              to="/articles"
              className={cn(
                'flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary-600',
                isActive('/articles') ? 'text-primary-600' : 'text-gray-700'
              )}
            >
              <BookOpenIcon className="w-4 h-4" />
              <span>Articles</span>
            </Link>
            <Link
              to="/podcasts"
              className={cn(
                'flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary-600',
                isActive('/podcasts') ? 'text-primary-600' : 'text-gray-700'
              )}
            >
              <MicrophoneIcon className="w-4 h-4" />
              <span>Podcasts</span>
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'contributor' && (
                  <Link
                    to="/dashboard"
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-primary-600',
                      isActive('/dashboard') ? 'text-primary-600' : 'text-gray-700'
                    )}
                  >
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-700">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;