import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/event-list', label: 'Events' },
    { path: '/my-tickets', label: 'My Tickets', protected: true },
    { path: '/create-event', label: 'Host Event', protected: true },
  ];

  return (
    <header className="bg-primary-200 border-b border-primary-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4">
            <span className="text-4xl">🎫</span>
            <span className="font-display text-3xl font-bold bg-gradient-to-r from-primary-600 via-accent-400 to-primary-600 bg-clip-text text-transparent">
              Ticketi
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => (
              (!link.protected || (link.protected && user)) && (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-base font-medium transition-colors duration-200 ${
                    isActive(link.path)
                      ? 'text-primary-600'
                      : 'text-neutral-700 hover:text-primary-500'
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-accent-300 flex items-center justify-center">
                    <span className="text-base font-medium text-neutral-800">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-base font-medium text-neutral-700">
                    {user.username}
                  </span>
                </div>
                <Button variant="ghost" size="md" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" size="md">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="md">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-3 rounded-lg text-neutral-700 hover:text-primary-600 hover:bg-primary-300">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 