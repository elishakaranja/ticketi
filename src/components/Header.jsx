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
    <header >
      <div >
        <div >
          {/* Logo */}
          <Link to="/">
            <span >🎫</span>
            <span >
              Ticketi
            </span>
          </Link>

          {/* Navigation */}
          <nav >
            {navLinks.map((link) => (
              (!link.protected || (link.protected && user)) && (
                <Link
                  key={link.path}
                  to={link.path}
                  
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          {/* Auth Buttons */}
          <div >
            {user ? (
              <div >
                <div >
                  <div >
                    <span >
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span >
                    {user.username}
                  </span>
                </div>
                <Button variant="ghost" size="md" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div >
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
          <button >
            <svg  fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;