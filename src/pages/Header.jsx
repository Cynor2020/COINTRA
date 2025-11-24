import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
// CurrencySelector removed as we only support USD

const Header = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const navLinks = [
    { name: 'Home', path: '/', section: 'home' },
    { name: 'Live Prices', path: '/#prices', section: 'prices' },
    { name: 'Features', path: '/#features', section: 'features' },
    { name: 'Pricing', path: '/#pricing', section: 'pricing' },
    { name: 'Contact', path: '/#contact', section: 'contact' }
  ];

  // Handle smooth scrolling with improved butter smoothness
  const handleScrollToSection = (sectionId) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['prices', 'features', 'pricing', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            return;
          }
        }
      }
      
      // If at top of page, set active section to home
      if (window.scrollY === 0) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
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
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection(link.section);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-gray-300 hover:text-orange-500 transition-all duration-300 font-medium cursor-pointer hover:scale-105 ${
                  activeSection === link.section ? 'text-orange-500 font-bold border-b-4 border-orange-500' : ''
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right side - Currency Selector and Auth */}
          <div className="flex items-center space-x-4">
            {/* CurrencySelector removed as we only support USD */}
            
            {user ? (
              <Link 
                to="/dashboard" 
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:scale-105 transition-transform"
              >
                Dashboard
              </Link>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="px-4 py-2 border border-orange-500 text-orange-500 text-sm font-medium rounded-lg hover:bg-orange-500/10 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:scale-105 transition-transform"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-400 hover:text-white cursor-pointer"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              {/* CurrencySelector removed as we only support USD */}
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleScrollToSection(link.section);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-gray-300 hover:text-orange-500 transition-all duration-300 font-medium block py-2 cursor-pointer hover:scale-105 ${
                    activeSection === link.section ? 'text-orange-500 font-bold border-b-4 border-orange-500' : ''
                  }`}
                >
                  {link.name}
                </a>
              ))}
              {!user && (
                <div className="flex space-x-3 pt-4">
                  <Link 
                    to="/login" 
                    className="flex-1 px-4 py-2 border border-orange-500 text-orange-500 text-sm font-medium rounded-lg text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;