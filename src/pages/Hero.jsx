import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#05071a]">
      {/* Background Glows */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/90 via-[#0a0e17] to-[#0f172a]/90" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="text-center lg:text-left"
        >
          {/* Logo */}
          <div className="flex justify-center lg:justify-start mb-8">
            <img
              src="/logo.png"
              alt="COINTRA"
              className="h-28 md:h-36 w-auto filter drop-shadow-[0_0_40px_rgba(249,115,22,0.8)]"
            />
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-6">
            AI-Powered Crypto<br />
            <span className="bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 bg-clip-text text-transparent">
              Market Analytics
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl">
            Real-time cryptocurrency data, advanced AI predictions, smart alerts, and comprehensive market insights for informed trading decisions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-16">
            <Link
              to="/signup"
              className="px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xl font-bold rounded-full shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-105 transition-all duration-300"
            >
              Start Free Analysis
            </Link>
            <a
              href="/#prices"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('prices');
                if (element) {
                  element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                  });
                }
              }}
              className="px-10 py-5 border-2 border-orange-500 text-orange-400 text-xl font-semibold rounded-full hover:bg-orange-500/10 transition-all duration-300 cursor-pointer"
            >
              View Live Prices
            </a>
          </div>

          {/* Stats */}
          
        </motion.div>

        {/* Right Side - Floating Phone + Coins */}
        <div className="relative flex justify-center items-center perspective-1000">
          {/* Glowing Orbit Path */}
          <div className="absolute w-96 h-96">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="w-full h-full"
            >
              <svg viewBox="0 0 400 400" className="w-full h-full">
                <circle cx="200" cy="200" r="180" fill="none" stroke="url(#orbit)" strokeWidth="2" opacity="0.4" />
                <defs>
                  <linearGradient id="orbit" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="50%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          </div>

          {/* Main Phone */}
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotateY: [-10, 10, -10]
            }}
            transition={{ 
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              rotateY: { duration: 12, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative z-10"
          >
            <img
              src="/mobile-mockup.png"
              alt="COINTRA Mobile App"
              className="w-84 md:w-96 lg:w-full max-w-lg drop-shadow-2xl"
              onError={(e) => e.target.src = "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=800&fit=crop"}
            />
          </motion.div>

          {/* Floating Bitcoin Coins */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute"
              animate={{
                y: [-30, 30, -30],
                rotate: [0, 360],
                x: [0, i % 2 === 0 ? 50 : -50, 0]
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                top: `${30 + i * 20}%`,
                [i === 0 ? 'right' : i === 1 ? 'left' : 'right']: `${10 + i * 15}%`,
              }}
            >
              <img 
                src="/btc-coin.png" 
                alt="Bitcoin" 
                className="w-24 md:w-32 drop-shadow-[0_0_30px_rgba(251,191,36,0.9)]"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;