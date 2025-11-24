import React from 'react';
import { Link } from 'react-router-dom';
import useTheme from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';

/**
 * Simple inline SVG icons to avoid extra icon deps.
 */

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline-block">
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
      <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  );
}

function SunMoonIcon({ isDark }) {
  if (isDark) {
    // sun icon
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline-block">
        <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  // moon icon
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline-block">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Navbar() {
  const [theme, setTheme] = useTheme();
  const { user, logout } = useAuth();

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <nav className="w-full bg-bg-800/60 backdrop-blur-sm border-b border-neutral-weak px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-accent-blue font-semibold text-lg">COINTRA</Link>

        <div className="hidden md:block">
          <input
            type="search"
            placeholder="Search coin (BTC, ETH...)"
            className="bg-transparent border border-neutral-weak rounded-md px-3 py-2 text-sm placeholder:muted text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
            aria-label="Search coins"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button aria-label="Notifications" className="p-2 rounded-md hover:bg-white/3" title="Notifications">
          <BellIcon />
        </button>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-md hover:bg-white/3"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <SunMoonIcon isDark={theme === 'dark'} />
        </button>

        {user ? (
          <>
            <div className="hidden md:block text-sm text-primary-text">
              Hi, <span className="font-medium">{user.name}</span>
            </div>
            <button
              onClick={logout}
              className="px-3 py-1 rounded-md border border-neutral-weak text-sm hover:bg-white/2"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth" className="px-3 py-1 rounded-md bg-accent-blue text-bg-900 text-sm font-medium">Create account / Login</Link>
        )}
      </div>
    </nav>
  );
}