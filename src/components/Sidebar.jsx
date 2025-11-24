import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  Star, 
  Brain, 
  Bell, 
  CreditCard,
  X,
  Menu
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Prices', icon: TrendingUp, path: '/prices' },
    { name: 'Watchlist', icon: Star, path: '/watchlist' },
    { name: 'AI Predictions', icon: Brain, path: '/predictions' },
    { name: 'Alerts', icon: Bell, path: '/alerts' },
    { name: 'Pricing', icon: CreditCard, path: '/pricing' }
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed bottom-4 right-4 z-30 p-3 bg-orange-500 rounded-full shadow-lg"
      >
        <Menu size={24} className="text-white" />
      </button>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 glass-card border-r border-white/10 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center">
              <img src="/vite.svg" alt="COINTRA Logo" className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold text-white">COINTRA</span>
            </div>
            <button 
              onClick={toggleSidebar}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <item.icon size={20} className="mr-3" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-white/10">
            <div className="text-center text-gray-400 text-sm">
              Made by Sarthak Anant Gadakh
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;