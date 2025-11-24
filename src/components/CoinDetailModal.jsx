import React from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { useWatchlist } from '../hooks/useWatchlist';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Add a helper function to extract image URL
const getImageUrl = (coin) => {
  if (typeof coin.image === 'string') {
    return coin.image;
  } else if (coin.image && typeof coin.image === 'object') {
    // Handle different image formats from CoinGecko API
    if (coin.image.large) {
      return coin.image.large;
    } else if (coin.image.small) {
      return coin.image.small;
    } else if (coin.image.thumb) {
      return coin.image.thumb;
    }
  }
  // Fallback to a default image
  return `https://via.placeholder.com/32/19191c/FFFFFF?text=${coin.symbol.toUpperCase()}`;
};

const CoinDetailModal = ({ coin, isOpen, onClose }) => {
  const { user } = useAuth();
  const { watchlist, addToWatchlist } = useWatchlist();
  
  if (!isOpen || !coin) return null;

  const isInWatchlist = watchlist?.find((item) => item.coinId === coin.id);

  const formatUSD = (value) => {
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
    return formatUSD(value);
  };

  const handleAddToWatchlist = async () => {
    if (isInWatchlist) {
      toast.error('Already in watchlist');
      return;
    }
    
    // Validate coin object before sending to backend
    if (!coin.id || !coin.name || !coin.symbol) {
      toast.error('Invalid coin data');
      return;
    }
    
    // Create a coin object with proper image URL
    const coinWithImageUrl = {
      ...coin,
      image: getImageUrl(coin)
    };
    
    const result = await addToWatchlist(coinWithImageUrl);
    if (result.success) {
      toast.success(`${coin.name} added to watchlist!`);
    } else {
      toast.error(result.error || 'Failed to add to watchlist');
    }
  };

  // Get proper image URL
  const imageUrl = getImageUrl(coin);

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
            <img src={imageUrl} alt={coin.name} className="w-16 h-16 rounded-full" />
            <div>
              <h2 className="text-2xl font-bold text-white">{coin.name} ({coin.symbol.toUpperCase()})</h2>
              <p className="text-gray-400">Rank #{coin.market_cap_rank}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-3xl font-bold text-white">${formatUSD(coin.current_price)}</p>
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="glass-card p-4 rounded-xl">
                    <p className="text-gray-400">Market Cap</p>
                    <p className="text-xl font-bold text-white">${formatMarketCap(coin.market_cap)}</p>
                  </div>
                  <div className="glass-card p-4 rounded-xl">
                    <p className="text-gray-400">24h Volume</p>
                    <p className="text-xl font-bold text-white">${formatMarketCap(coin.total_volume)}</p>
                  </div>
                  <div className="glass-card p-4 rounded-xl">
                    <p className="text-gray-400">All Time High</p>
                    <p className="text-xl font-bold text-white">${formatUSD(coin.ath)}</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
                <p className="text-xl font-bold text-white mb-4 text-center">
                  Sign Up to Unlock Full Chart & Add to Watchlist
                </p>
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="glass-card p-4 rounded-xl">
                  <p className="text-gray-400">Market Cap</p>
                  <p className="text-xl font-bold text-white">${formatMarketCap(coin.market_cap)}</p>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <p className="text-gray-400">24h Volume</p>
                  <p className="text-xl font-bold text-white">${formatMarketCap(coin.total_volume)}</p>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <p className="text-gray-400">All Time High</p>
                  <p className="text-xl font-bold text-white">${formatUSD(coin.ath)}</p>
                </div>
              </div>
              
              <button
                onClick={handleAddToWatchlist}
                disabled={isInWatchlist}
                className={`w-full py-3 font-semibold rounded-lg transition-all ${
                  isInWatchlist 
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:scale-105'
                }`}
              >
                {isInWatchlist ? 'Already in Watchlist' : 'Add to Watchlist'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoinDetailModal;