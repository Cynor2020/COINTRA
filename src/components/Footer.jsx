import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] border-t border-white/10 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <img 
              src="/logo.png" 
              alt="COINTRA Logo" 
              className="h-8 w-auto mr-3 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              onError={(e) => {
                e.target.src = '/vite.svg';
              }}
            />
            <p className="text-gray-400">
              Made with <Heart className="inline text-red-500" size={16} /> by Sarthak Anant Gadakh
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end space-x-6">
            <Link to="/privacy" className="text-gray-400 hover:text-orange-500 transition-all duration-300 hover:scale-105 cursor-pointer">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-orange-500 transition-all duration-300 hover:scale-105 cursor-pointer">
              Terms
            </Link>
            <a href="/#contact" className="text-gray-400 hover:text-orange-500 transition-all duration-300 hover:scale-105 cursor-pointer">
              Contact
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          © 2025 COINTRA. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;