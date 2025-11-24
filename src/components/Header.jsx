import React, { useState } from 'react';
import { Home, Star, Bell, Sparkles, LogOut, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    // Don't navigate here, let ProtectedRoute handle it
  };

  return (
    <header className="sticky top-0 z-[100] bg-[#0f172a]/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-none mx-0 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/dashboard">
              <img 
                src="/logo.png" 
                alt="COINTRA Logo" 
                className="h-12 w-auto filter drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]"
                onError={(e) => {
                  e.target.src = '/vite.svg';
                }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/dashboard" className="flex items-center gap-2 text-gray-300 hover:text-orange-500 font-medium">
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link to="/watchlist" className="flex items-center gap-2 text-gray-300 hover:text-orange-500 font-medium">
              <Star className="h-5 w-5" />
              <span>My Watchlist</span>
            </Link>
            <Link to="/alerts" className="flex items-center gap-2 text-gray-300 hover:text-orange-500 font-medium">
              <Bell className="h-5 w-5" />
              <span>My Alerts</span>
            </Link>
            <Link to="/ai" className="flex items-center gap-2 text-gray-300 hover:text-orange-500 font-medium">
              <Sparkles className="h-5 w-5" />
              <span>COINTRA AI</span>
            </Link>
          </nav>

          {/* Right side - Notification Bell and Auth */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => navigate('/alerts')}
                className="relative p-2 text-gray-300 hover:text-orange-500 transition-colors"
              >
                <Bell size={20} />
                {/* Notification count will be updated with real backend data */}
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  0
                </span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-white font-medium">
                {user?.name || 'User'}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      
        {/* Mobile Navigation */}
        <div className="md:hidden py-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            <nav className="flex space-x-4">
              <Link to="/dashboard" className="flex flex-col items-center gap-1 text-gray-300">
                <Home className="h-5 w-5" />
                <span className="text-xs">Dashboard</span>
              </Link>
              <Link to="/watchlist" className="flex flex-col items-center gap-1 text-gray-300">
                <Star className="h-5 w-5" />
                <span className="text-xs">Watchlist</span>
              </Link>
              <Link to="/alerts" className="flex flex-col items-center gap-1 text-gray-300">
                <Bell className="h-5 w-5" />
                <span className="text-xs">Alerts</span>
              </Link>
              <Link to="/ai" className="flex flex-col items-center gap-1 text-gray-300">
                <Sparkles className="h-5 w-5" />
                <span className="text-xs">AI</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;