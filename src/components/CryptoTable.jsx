import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useBinanceWebSocket } from '../hooks/useBinanceWebSocket';
import CoinModal from './CoinModal';

const CryptoTable = ({ coins, isLoading, error }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currency, setCurrency] = useState('INR');
  const [visibleCoins, setVisibleCoins] = useState(5); // Show only 5 coins by default
  const [loadingMore, setLoadingMore] = useState(false);

  // Get coin IDs for WebSocket
  const coinIds = useMemo(() => coins.slice(0, visibleCoins).map(coin => coin.id), [coins, visibleCoins]);
  const wsPrices = useBinanceWebSocket(coinIds);

  // Listen for currency changes
  useEffect(() => {
    const handleCurrencyChange = (e) => {
      setCurrency(e.detail);
    };

    window.addEventListener('currencyChange', handleCurrencyChange);
    return () => {
      window.removeEventListener('currencyChange', handleCurrencyChange);
    };
  }, []);

  // Currency conversion rates (simplified)
  const conversionRates = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
    AED: 0.044,
    SGD: 0.016,
    AUD: 0.018,
    JPY: 1.8
  };

  // Convert price based on selected currency
  const convertPrice = (price) => {
    const rate = conversionRates[currency] || 1;
    return price * rate;
  };

  // Format price based on selected currency
  const formatPrice = (value) => {
    const convertedValue = convertPrice(value);
    
    return new Intl.NumberFormat('en-US', {
      style: currency === 'INR' ? 'currency' : 'decimal',
      currency: currency === 'INR' ? 'INR' : undefined,
      minimumFractionDigits: convertedValue < 1 ? 4 : 2,
      maximumFractionDigits: convertedValue < 1 ? 4 : 2,
    }).format(convertedValue);
  };

  // Format market cap
  const formatMarketCap = (value) => {
    const convertedValue = convertPrice(value);
    
    if (convertedValue >= 1000000000000) {
      return `${currency === 'INR' ? '₹' : ''}${(convertedValue / 1000000000000).toFixed(2)}T`;
    }
    if (convertedValue >= 1000000000) {
      return `${currency === 'INR' ? '₹' : ''}${(convertedValue / 1000000000).toFixed(2)}B`;
    }
    if (convertedValue >= 1000000) {
      return `${currency === 'INR' ? '₹' : ''}${(convertedValue / 1000000).toFixed(2)}M`;
    }
    return formatPrice(convertedValue);
  };

  // Get live price from WebSocket or fallback to CoinGecko
  const getLivePrice = (coin) => {
    const symbol = coin.symbol.toLowerCase();
    const wsPrice = wsPrices[symbol];
    
    if (wsPrice) {
      // Convert USD price to selected currency
      const convertedPrice = convertPrice(wsPrice.price);
      return {
        price: convertedPrice,
        change24h: wsPrice.change24h,
        isLive: true
      };
    }
    
    return {
      price: convertPrice(coin.current_price),
      change24h: coin.price_change_percentage_24h,
      isLive: false
    };
  };

  // Filter coins based on active filter
  const filteredCoins = useMemo(() => {
    let filtered = [...coins];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(coin => 
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    switch (activeFilter) {
      case 'gainers':
        filtered = filtered.filter(coin => coin.price_change_percentage_24h > 0);
        break;
      case 'losers':
        filtered = filtered.filter(coin => coin.price_change_percentage_24h < 0);
        break;
      default:
        break;
    }

    return filtered.slice(0, visibleCoins);
  }, [coins, activeFilter, searchQuery, visibleCoins]);

  // Handle "View More" button click
  const handleViewMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCoins(prev => prev + 5);
      setLoadingMore(false);
    }, 300); // 0.3s delay
  };

  // Handle coin selection
  const handleCoinSelect = (coin) => {
    setSelectedCoin(coin);
    setIsModalOpen(true);
  };

  // Skeleton row for loading state
  const SkeletonRow = () => (
    <tr className="border-b border-white/10 animate-pulse">
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-700 rounded w-6"></div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-700 mr-3"></div>
          <div>
            <div className="h-4 bg-gray-700 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-12"></div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-700 rounded w-20"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-700 rounded w-16"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-700 rounded w-16"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-700 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-700 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-10 bg-gray-700 rounded w-32"></div>
      </td>
    </tr>
  );

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-red-500 mb-2">Failed to Load Data</h3>
        <p className="text-gray-400 mb-4">{error.message}</p>
      </div>
    );
  }

  return (
    <section id="prices" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Live Cryptocurrency Prices</h2>
        </div>

        {/* Search and Filters */}
        <div className="glass-card rounded-xl p-6 mb-8 border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search coins..."
                  className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 text-sm rounded-lg ${
                  activeFilter === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('gainers')}
                className={`px-4 py-2 text-sm rounded-lg ${
                  activeFilter === 'gainers'
                    ? 'bg-green-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                Gainers
              </button>
              <button
                onClick={() => setActiveFilter('losers')}
                className={`px-4 py-2 text-sm rounded-lg ${
                  activeFilter === 'losers'
                    ? 'bg-red-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                Losers
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left text-gray-400 font-medium text-sm">#</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium text-sm">Name</th>
                  <th className="px-4 py-3 text-right text-gray-400 font-medium text-sm">Price</th>
                  <th className="px-4 py-3 text-right text-gray-400 font-medium text-sm">24h %</th>
                  <th className="px-4 py-3 text-right text-gray-400 font-medium text-sm">7d %</th>
                  <th className="px-4 py-3 text-right text-gray-400 font-medium text-sm">Market Cap</th>
                  <th className="px-4 py-3 text-right text-gray-400 font-medium text-sm">Volume</th>
                  <th className="px-4 py-3 text-right text-gray-400 font-medium text-sm">Last 7 Days</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonRow key={index} />
                  ))
                ) : (
                  filteredCoins.map((coin, index) => {
                    const livePrice = getLivePrice(coin);
                    const isPositive24h = livePrice.change24h >= 0;
                    const isPositive7d = coin.price_change_percentage_7d >= 0;

                    return (
                      <tr 
                        key={coin.id} 
                        onClick={() => handleCoinSelect(coin)}
                        className="border-b border-white/10 hover:bg-white/5 cursor-pointer transition-all duration-300 hover:scale-[1.01] animate-fadeIn hover:shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                      >
                        <td className="px-4 py-3 text-gray-400 font-medium">
                          {coin.market_cap_rank}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <img src={coin.image} alt={coin.name} className="w-8 h-8 mr-3 rounded-full" />
                            <div>
                              <div className="font-medium text-white">{coin.symbol.toUpperCase()}</div>
                              <div className="text-gray-400 text-sm">{coin.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-white">
                          {formatPrice(livePrice.price)}
                          {livePrice.isLive && (
                            <span className="ml-1 text-xs text-green-500">●</span>
                          )}
                        </td>
                        <td className={`px-4 py-3 text-right font-medium ${isPositive24h ? 'text-green-500' : 'text-red-500'}`}>
                          <div className="flex items-center justify-end">
                            {isPositive24h ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                            {Math.abs(livePrice.change24h).toFixed(2)}%
                          </div>
                        </td>
                        <td className={`px-4 py-3 text-right font-medium ${isPositive7d ? 'text-green-500' : 'text-red-500'}`}>
                          <div className="flex items-center justify-end">
                            {isPositive7d ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                            {Math.abs(coin.price_change_percentage_7d).toFixed(2)}%
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-white">
                          {formatMarketCap(coin.market_cap)}
                        </td>
                        <td className="px-4 py-3 text-right text-white">
                          {formatMarketCap(coin.total_volume)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-10 w-32">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={coin.sparkline_in_7d?.price?.map((price, i) => ({ 
                                time: i, 
                                price: convertPrice(price)
                              })) || []}>
                                <Line 
                                  type="monotone" 
                                  dataKey="price" 
                                  stroke={isPositive7d ? "#10b981" : "#ef4444"} 
                                  strokeWidth={2} 
                                  dot={false} 
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* View More Button */}
        <div className="text-center mt-8">
          <button
            onClick={handleViewMore}
            disabled={loadingMore || visibleCoins >= coins.length}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] cursor-pointer"
          >
            {loadingMore ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </div>
            ) : (
              `View More (+5)`
            )}
          </button>
        </div>
      </div>

      {/* Coin Modal */}
      <CoinModal 
        coin={selectedCoin}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default CryptoTable;