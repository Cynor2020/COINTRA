import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCoinMarkets } from '../services/coingecko';
import { useBinanceWebSocket } from '../hooks/useBinanceWebSocket';
import { useWatchlist } from '../hooks/useWatchlist';
import { TrendingUp, TrendingDown, Star, LogOut, ChevronDown, ChevronUp, Home, Bell, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import SkeletonLoader from '../components/SkeletonLoader';

export default function Watchlist() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { watchlist, loading: watchlistLoading, error: watchlistError, fetchWatchlist, removeFromWatchlist: removeWatchlistItem } = useWatchlist();
  const [coins, setCoins] = useState([]);
  const [displayedCoins, setDisplayedCoins] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const coinsPerPage = 20;

  // Fetch coins data
  const { data: apiCoins = [], isLoading: apiLoading, error: apiError, refetch } = useQuery({
    queryKey: ['coins'],
    queryFn: () => {
      console.log('Fetching coins from CoinGecko API...');
      return getCoinMarkets('usd', 250);
    },
    refetchInterval: 60000,
    staleTime: 30000,
    retry: 2,
  });

  // Top 10 coin IDs for WebSocket
  const topCoinIds = apiCoins.slice(0, 10).map((coin) => coin.id);
  const wsPrices = useBinanceWebSocket(topCoinIds);

  // Update coins when API data changes
  useEffect(() => {
    console.log('API Coins updated:', apiCoins.length);
    if (apiCoins.length > 0) {
      setCoins(apiCoins);
      // Initially display first 20 coins
      const initialCoins = apiCoins.slice(0, coinsPerPage);
      setDisplayedCoins(initialCoins);
      console.log('Setting displayed coins:', initialCoins.length);
      setIsLoading(false);
    }
    if (apiError) {
      console.error('API Error:', apiError);
      // Even with error, we might have mock data, so still try to display something
      if (apiCoins.length > 0) {
        setCoins(apiCoins);
        setDisplayedCoins(apiCoins.slice(0, coinsPerPage));
      }
      setError(apiError);
      setIsLoading(false);
    }
  }, [apiCoins, apiError]);

  // Load more coins
  const loadMoreCoins = () => {
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * coinsPerPage;
    const endIndex = startIndex + coinsPerPage;
    const newCoins = coins.slice(startIndex, endIndex);
    
    console.log('Loading more coins:', newCoins.length, 'from index', startIndex, 'to', endIndex);
    
    if (newCoins.length > 0) {
      setDisplayedCoins(prev => [...prev, ...newCoins]);
      setPage(nextPage);
    }
  };

  // Handle watchlist errors
  useEffect(() => {
    if (watchlistError) {
      toast.error(watchlistError);
    }
  }, [watchlistError]);

  const removeFromWatchlist = async (coinId) => {
    const result = await removeWatchlistItem(coinId);
    if (result.success) {
      toast.success('Removed from watchlist');
    } else {
      toast.error(result.error);
    }
  };

  const handleLogout = () => {
    logout();
    // Don't navigate here, let ProtectedRoute handle it
  };

  const getLivePrice = (coinId) => {
    const coin = coins.find((c) => c.id === coinId);
    if (!coin) return null;
    const symbol = coin.symbol.toLowerCase();
    const wsPrice = wsPrices[symbol];
    if (wsPrice) {
      return {
        price: wsPrice.price, // Already in USD
        change1h: wsPrice.change1h || coin.price_change_percentage_1h,
        change24h: wsPrice.change24h,
        change7d: coin.price_change_percentage_7d,
      };
    }
    return {
      price: coin.current_price,
      change1h: coin.price_change_percentage_1h,
      change24h: coin.price_change_percentage_24h,
      change7d: coin.price_change_percentage_7d,
    };
  };

  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(2);
  };

  // Format supply
  const formatSupply = (supply) => {
    if (supply >= 1000000000) {
      return (supply / 1000000000).toFixed(2) + 'B';
    }
    if (supply >= 1000000) {
      return (supply / 1000000).toFixed(2) + 'M';
    }
    return supply.toLocaleString();
  };

  // Sort coins
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get watchlist coins
  const watchlistCoins = coins.filter(coin => 
    watchlist.find(w => w.coinId === coin.id)
  ).filter(coin => 
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Apply sorting
  const sortedWatchlistCoins = [...watchlistCoins];
  if (sortConfig.key) {
    sortedWatchlistCoins.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      // Special handling for nested properties
      if (sortConfig.key === 'current_price') {
        const aPrice = getLivePrice(a.id)?.price || a.current_price;
        const bPrice = getLivePrice(b.id)?.price || b.current_price;
        aValue = aPrice;
        bValue = bPrice;
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // Render coin row (for both desktop and mobile)
  const renderCoinRow = (coin, index, isMobile = false) => {
    const livePrice = getLivePrice(coin.id);
    const price = livePrice?.price || coin.current_price;
    const change1h = livePrice?.change1h || coin.price_change_percentage_1h;
    const change24h = livePrice?.change24h || coin.price_change_percentage_24h;
    const change7d = livePrice?.change7d || coin.price_change_percentage_7d;
    const isPositive1h = change1h >= 0;
    const isPositive24h = change24h >= 0;
    const isPositive7d = change7d >= 0;
    
    // Generate sparkline data for the last 7 days
    const sparklineData = coin.sparkline_in_7d?.price?.map((price, i) => ({
      value: price,
    })) || [];
    
    if (!isMobile) {
      // Desktop table row
      return (
        <tr key={coin.id} className="hover:bg-[#19191c]/50">
          <td className="px-4 py-3 text-sm text-gray-400">{index + 1}</td>
          <td className="px-4 py-3">
            <div className="flex items-center">
              <img 
                src={coin.image} 
                alt={coin.name} 
                className="h-8 w-8 rounded-full"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/32/19191c/FFFFFF?text=' + coin.symbol.toUpperCase();
                }}
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-white">{coin.name}</div>
                <div className="text-sm text-gray-400">{coin.symbol.toUpperCase()}</div>
              </div>
            </div>
          </td>
          <td className="px-4 py-3 text-sm text-right text-white">
            ${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </td>
          <td className={`px-4 py-3 text-sm text-right ${isPositive1h ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive1h ? '+' : ''}{change1h?.toFixed(2)}%
          </td>
          <td className={`px-4 py-3 text-sm text-right ${isPositive24h ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive24h ? '+' : ''}{change24h?.toFixed(2)}%
          </td>
          <td className={`px-4 py-3 text-sm text-right ${isPositive7d ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive7d ? '+' : ''}{change7d?.toFixed(2)}%
          </td>
          <td className="px-4 py-3 text-sm text-right text-white">
            ${formatNumber(coin.market_cap)}
          </td>
          <td className="px-4 py-3 text-sm text-right text-white">
            ${formatNumber(coin.total_volume)}
          </td>
          <td className="px-4 py-3 text-sm text-right text-white">
            {formatSupply(coin.circulating_supply)} {coin.symbol.toUpperCase()}
          </td>
          <td className="px-4 py-3 text-sm">
            <div className="h-10 w-24">
              {sparklineData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={change7d >= 0 ? "#10b981" : "#ef4444"} 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  N/A
                </div>
              )}
            </div>
          </td>
          <td className="px-4 py-3 text-sm text-right">
            <button
              onClick={() => removeFromWatchlist(coin.id)}
              className="p-2 rounded-full text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/20"
            >
              <Star className="h-5 w-5" fill="currentColor" />
            </button>
          </td>
        </tr>
      );
    }
    
    // Mobile card
    return (
      <div 
        key={coin.id} 
        className="glass-card rounded-xl p-4 border border-white/10 hover:border-orange-500/50 transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-gray-400">{index + 1}</span>
            <img 
              src={coin.image} 
              alt={coin.name} 
              className="h-10 w-10 rounded-full"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/40/19191c/FFFFFF?text=' + coin.symbol.toUpperCase();
              }}
            />
            <div>
              <h3 className="font-semibold text-white">{coin.name}</h3>
              <p className="text-sm text-gray-400">{coin.symbol.toUpperCase()}</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-lg font-bold text-white">
              ${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </p>
            <div className={`flex items-center justify-end ${isPositive24h ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive24h ? (
                <TrendingUp className="h-4 w-4 inline mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 inline mr-1" />
              )}
              <span className="font-medium">
                {isPositive24h ? '+' : ''}{change24h?.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
          <div>
            <p className="text-gray-400">1h</p>
            <p className={isPositive1h ? 'text-green-500' : 'text-red-500'}>
              {isPositive1h ? '+' : ''}{change1h?.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-gray-400">7d</p>
            <p className={isPositive7d ? 'text-green-500' : 'text-red-500'}>
              {isPositive7d ? '+' : ''}{change7d?.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-gray-400">Market Cap</p>
            <p className="text-white">${formatNumber(coin.market_cap)}</p>
          </div>
          <div>
            <p className="text-gray-400">Volume</p>
            <p className="text-white">${formatNumber(coin.total_volume)}</p>
          </div>
        </div>
        
        <div className="mt-3">
          <p className="text-gray-400 text-sm">Last 7 Days</p>
          <div className="h-12 w-full mt-1">
            {sparklineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={change7d >= 0 ? "#10b981" : "#ef4444"} 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                N/A
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end mt-3">
          <button
            onClick={() => removeFromWatchlist(coin.id)}
            className="p-2 rounded-full text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/20"
          >
            <Star className="h-5 w-5" fill="currentColor" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#05071a]">
      {/* Background Glows - Fixed position so they don't scroll */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0f172a]/90 via-[#0a0e17] to-[#0f172a]/90 pointer-events-none" />
      <div className="fixed top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
      
      {/* Content Container - This will scroll */}
      <div className="relative z-10">
        {/* Use shared Header component */}
        <Header />
      
        <div className="relative z-10 max-w-none mx-0 px-0">
          {/* Watchlist Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6 px-4 md:px-6">
              <h2 className="text-2xl font-bold text-white">My Watchlist</h2>
              <div className="text-sm text-gray-400">
                {sortedWatchlistCoins.length} coins
              </div>
            </div>
          
            {apiLoading && watchlist.length > 0 ? (
              <div className="space-y-4 px-4 md:px-6">
                {[...Array(5)].map((_, i) => (
                  <SkeletonLoader key={i} className="h-16" type="card" />
                ))}
              </div>
            ) : apiError && watchlist.length > 0 ? (
              <div className="glass-card rounded-xl p-6 text-center mx-4 md:mx-6">
                <p className="text-red-500">Failed to fetch coin data: {apiError.message}</p>
                <p className="text-gray-400 mt-2">Displaying mock data for demonstration purposes</p>
                <button 
                  onClick={() => refetch()} 
                  className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : watchlist.length === 0 ? (
              <div className="glass-card rounded-xl p-8 text-center border border-white/10 mx-4 md:mx-6">
                <Star className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Your watchlist is empty</h3>
                <p className="text-gray-400 mb-4">Add coins to your watchlist to track them here</p>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Browse Coins
                </Link>
              </div>
            ) : (
              <div className="space-y-4 px-0 md:px-0">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">#</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Coin</th>
                        <th 
                          className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                          onClick={() => requestSort('current_price')}
                        >
                          <div className="flex items-center justify-end">
                            Price
                            {sortConfig.key === 'current_price' && (
                              sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                          onClick={() => requestSort('price_change_percentage_1h')}
                        >
                          <div className="flex items-center justify-end">
                            1h %
                            {sortConfig.key === 'price_change_percentage_1h' && (
                              sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                          onClick={() => requestSort('price_change_percentage_24h')}
                        >
                          <div className="flex items-center justify-end">
                            24h %
                            {sortConfig.key === 'price_change_percentage_24h' && (
                              sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                          onClick={() => requestSort('price_change_percentage_7d')}
                        >
                          <div className="flex items-center justify-end">
                            7d %
                            {sortConfig.key === 'price_change_percentage_7d' && (
                              sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                          onClick={() => requestSort('market_cap')}
                        >
                          <div className="flex items-center justify-end">
                            Market Cap
                            {sortConfig.key === 'market_cap' && (
                              sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                          onClick={() => requestSort('total_volume')}
                        >
                          <div className="flex items-center justify-end">
                            Volume(24h)
                            {sortConfig.key === 'total_volume' && (
                              sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Circulating Supply</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Last 7 Days</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {apiLoading ? (
                        [...Array(5)].map((_, i) => (
                          <SkeletonLoader key={i} type="table" />
                        ))
                      ) : (
                        sortedWatchlistCoins.slice(0, displayedCoins.length).map((coin, index) => renderCoinRow(coin, index))
                      )}
                    </tbody>
                  </table>
                </div>
              
                {/* Mobile List */}
                <div className="md:hidden space-y-4 px-4 md:px-6">
                  {apiLoading ? (
                    [...Array(3)].map((_, i) => (
                      <SkeletonLoader key={i} className="h-40" type="card" />
                    ))
                  ) : (
                    sortedWatchlistCoins.slice(0, displayedCoins.length).map((coin, index) => renderCoinRow(coin, index, true))
                  )}
                </div>
              
                {/* View More Button */}
                {sortedWatchlistCoins.length > displayedCoins.length && (
                  <div className="text-center mt-8">
                    <button
                      onClick={loadMoreCoins}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform"
                    >
                      View More
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}