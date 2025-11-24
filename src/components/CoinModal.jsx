import React from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const CoinModal = ({ coin, isOpen, onClose }) => {
  const { user } = useAuth();
  
  if (!isOpen || !coin) return null;

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 4 : 2,
    }).format(value);
  };

  const formatMarketCap = (value) => {
    if (value >= 1000000000000) {
      return `$${(value / 1000000000000).toFixed(2)}T`;
    }
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    return formatPrice(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X size={20} className="text-white" />
        </button>

        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
            <img src={coin.image} alt={coin.name} className="w-16 h-16 rounded-full" />
            <div>
              <h2 className="text-2xl font-bold text-white">{coin.name} ({coin.symbol.toUpperCase()})</h2>
              <p className="text-gray-400">Rank #{coin.market_cap_rank}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-3xl font-bold text-white">${formatPrice(coin.current_price)}</p>
              <div className={`flex items-center ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span className="ml-1 font-medium">
                  {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {!user ? (
            <div className="relative">
              <div className="blur-sm">
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={coin?.sparkline_in_7d?.price?.map((price, i) => ({ 
                      time: `Day ${i+1}`, 
                      price 
                    })) || []}>
                      <XAxis dataKey="time" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          background: '#1e293b',
                          border: '1px solid rgba(249, 115, 22, 0.3)',
                          borderRadius: '8px',
                          color: '#fff',
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#f97316" 
                        strokeWidth={2} 
                        dot={false} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="glass-card p-4 rounded-xl">
                    <p className="text-gray-400">Market Cap</p>
                    <p className="text-xl font-bold text-white">${formatMarketCap(coin.market_cap)}</p>
                  </div>
                  <div className="glass-card p-4 rounded-xl">
                    <p className="text-gray-400">24h Volume</p>
                    <p className="text-xl font-bold text-white">${formatMarketCap(coin.total_volume)}</p>
                  </div>
                  <div className="glass-card p-4 rounded-xl">
                    <p className="text-gray-400">Circulating Supply</p>
                    <p className="text-xl font-bold text-white">{(coin.circulating_supply / 1000000).toFixed(2)}M</p>
                  </div>
                  <div className="glass-card p-4 rounded-xl">
                    <p className="text-gray-400">All Time High</p>
                    <p className="text-xl font-bold text-white">${formatPrice(coin.ath)}</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
                <p className="text-xl font-bold text-white mb-4 text-center">
                  Sign Up to Unlock Full Chart & Data
                </p>
                
                {/* Additional features to encourage signup */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 w-full max-w-2xl">
                  <div className="glass-card p-4 rounded-xl text-center">
                    <div className="text-orange-500 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <p className="text-white font-medium">SET Alert</p>
                  </div>
                  
                  <div className="glass-card p-4 rounded-xl text-center">
                    <div className="text-orange-500 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <p className="text-white font-medium">News</p>
                  </div>
                  
                  <div className="glass-card p-4 rounded-xl text-center">
                    <div className="text-orange-500 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <p className="text-white font-medium">Risk Score</p>
                  </div>
                  
                  <div className="glass-card p-4 rounded-xl text-center">
                    <div className="text-orange-500 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <p className="text-white font-medium">AI Predictions</p>
                  </div>
                  
                  <div className="glass-card p-4 rounded-xl text-center">
                    <div className="text-orange-500 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>
                    <p className="text-white font-medium">Add Watchlist</p>
                  </div>
                  
                  <div className="glass-card p-4 rounded-xl text-center">
                    <div className="text-orange-500 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-white font-medium">Premium Insights</p>
                  </div>
                </div>
                
                <Link 
                  to="/signup" 
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform"
                >
                  Sign Up Now
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={coin?.sparkline_in_7d?.price?.map((price, i) => ({ 
                    time: `Day ${i+1}`, 
                    price 
                  })) || []}>
                    <XAxis dataKey="time" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        background: '#1e293b',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#f97316" 
                      strokeWidth={2} 
                      dot={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="glass-card p-4 rounded-xl">
                  <p className="text-gray-400">Market Cap</p>
                  <p className="text-xl font-bold text-white">${formatMarketCap(coin.market_cap)}</p>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <p className="text-gray-400">24h Volume</p>
                  <p className="text-xl font-bold text-white">${formatMarketCap(coin.total_volume)}</p>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <p className="text-gray-400">Circulating Supply</p>
                  <p className="text-xl font-bold text-white">{(coin.circulating_supply / 1000000).toFixed(2)}M</p>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <p className="text-gray-400">All Time High</p>
                  <p className="text-xl font-bold text-white">${formatPrice(coin.ath)}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoinModal;