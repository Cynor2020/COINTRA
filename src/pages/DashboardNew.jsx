import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCoinMarkets } from '../services/coingecko';
import { useBinanceWebSocket } from '../hooks/useBinanceWebSocket';
import { useWatchlist } from '../hooks/useWatchlist';
import { TrendingUp, TrendingDown, Star, LogOut, Search, ChevronDown, ChevronUp, Home, Bell, Sparkles, ArrowUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import SkeletonLoader from '../components/SkeletonLoader';

export default function DashboardNew() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { watchlist, loading: watchlistLoading, error: watchlistError, fetchWatchlist, addToWatchlist: addWatchlistItem, removeFromWatchlist: removeWatchlistItem } = useWatchlist();
  
  // State variables need to be declared before they're used in hooks
  const [coins, setCoins] = useState([]);
  const [displayedCoins, setDisplayedCoins] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceChangeFilter, setPriceChangeFilter] = useState('all');
  const [marketCapFilter, setMarketCapFilter] = useState('all');
  const coinsPerPage = 1000;
  
  // Apply sorting and filtering
  const getSortedAndFilteredCoins = () => {
    let filtered = coins.filter(coin => 
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Apply price change filter
    if (priceChangeFilter === 'gainers') {
      filtered = filtered.filter(coin => coin.price_change_percentage_24h > 0);
    } else if (priceChangeFilter === 'losers') {
      filtered = filtered.filter(coin => coin.price_change_percentage_24h < 0);
    }
    
    // Apply market cap filter
    if (marketCapFilter === 'large') {
      filtered = filtered.filter(coin => coin.market_cap >= 10000000000); // 10B+
    } else if (marketCapFilter === 'mid') {
      filtered = filtered.filter(coin => coin.market_cap >= 1000000000 && coin.market_cap < 10000000000); // 1B-10B
    } else if (marketCapFilter === 'small') {
      filtered = filtered.filter(coin => coin.market_cap < 1000000000); // <1B
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
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
    
    return filtered;
  };

  const sortedAndFilteredCoins = getSortedAndFilteredCoins();
  
  console.log('DashboardNew - Watchlist:', watchlist);
  console.log('DashboardNew - Watchlist Loading:', watchlistLoading);
  console.log('DashboardNew - Watchlist Error:', watchlistError);
  
  // Log when component mounts
  useEffect(() => {
    console.log('DashboardNew component mounted');
    console.log('Initial coins state:', coins.length);
    console.log('Initial displayedCoins state:', displayedCoins.length);
    console.log('Sorted and filtered coins length:', sortedAndFilteredCoins.length);
    // Ensure we have displayed coins if we have coins but no displayed coins
    if (coins.length > 0 && displayedCoins.length === 0) {
      console.log('Setting initial displayed coins from existing coins');
      const initialCoins = coins.slice(0, coinsPerPage);
      setDisplayedCoins(initialCoins);
    }
    return () => {
      console.log('DashboardNew component unmounted');
    };
  }, [coins.length, displayedCoins.length, coinsPerPage, sortedAndFilteredCoins.length]);
  
  // Ensure we always display at least 20 coins
  useEffect(() => {
    if (coins.length > 0 && displayedCoins.length < 20) {
      console.log('Ensuring at least 20 coins are displayed');
      const initialCoins = coins.slice(0, 20);
      setDisplayedCoins(initialCoins);
    }
  }, [coins.length, displayedCoins.length]);
  
  // Ensure we always have at least 20 coins displayed from coins state
  useEffect(() => {
    if (coins.length > 0 && displayedCoins.length === 0) {
      console.log('Ensuring initial 20 coins are displayed from coins state');
      const initialCoins = coins.slice(0, 20);
      setDisplayedCoins(initialCoins);
    }
  }, [coins.length, displayedCoins.length]);

  // Get coin IDs for WebSocket
  const coinIds = coins.slice(0, 10).map(coin => coin.id);
  
  // Use Binance WebSocket for live prices
  const wsPrices = useBinanceWebSocket(coinIds);

  // Fetch coins data
  const { data: apiCoins = [], isLoading: apiLoading, error: apiError, refetch, isFetching } = useQuery({
    queryKey: ['coins'],
    queryFn: () => {
      console.log('Fetching coins from CoinGecko API...');
      // Always use USD currency
      return getCoinMarkets('usd', 1000); // Fetch 1000 coins instead of 500
    },
    refetchInterval: 60000,
    staleTime: 30000,
    retry: 2,
    cacheTime: 300000, // Cache for 5 minutes
  });
  
  // Log query state
  useEffect(() => {
    console.log('Query state - isFetching:', isFetching, 'isLoading:', apiLoading, 'data length:', apiCoins.length);
  }, [isFetching, apiLoading, apiCoins.length]);

  // Update coins when API data changes
  useEffect(() => {
    console.log('API Coins updated:', apiCoins.length);
    console.log('Current coins state:', coins.length);
    console.log('Current displayedCoins state:', displayedCoins.length);
    if (apiCoins.length > 0) {
      console.log('Setting coins from API data');
      setCoins(apiCoins);
      // Display all coins instead of just 20
      setDisplayedCoins(apiCoins);
      console.log('Setting displayed coins:', apiCoins.length);
      setIsLoading(false);
    }
    if (apiError) {
      console.error('API Error:', apiError);
      // Even with error, we might have mock data, so still try to display something
      if (apiCoins.length > 0) {
        setCoins(apiCoins);
        setDisplayedCoins(apiCoins);
      }
      setError(apiError);
      setIsLoading(false);
    }
  }, [apiCoins, apiError, coinsPerPage, coins.length, displayedCoins.length]);
  
  // Ensure we always have coins displayed
  useEffect(() => {
    if (coins.length > 0 && displayedCoins.length < coins.length) {
      console.log('Ensuring all coins are displayed from existing coins state');
      setDisplayedCoins(coins);
    }
  }, [coins.length, displayedCoins.length]);

  // Removed localStorage watchlist saving - now using backend API

  // Reset pagination when filters or search query change
  useEffect(() => {
    console.log('Resetting display due to filter/search change');
    setPage(1);
    // Display all sorted and filtered coins instead of just a page
    setDisplayedCoins(sortedAndFilteredCoins);
    console.log('Setting displayed coins after filter/search change:', sortedAndFilteredCoins.length);
  }, [searchQuery, priceChangeFilter, marketCapFilter, sortConfig, sortedAndFilteredCoins.length, coinsPerPage]);
  
  // Log when displayed coins change
  useEffect(() => {
    console.log('Displayed coins changed:', displayedCoins.length);
  }, [displayedCoins.length]);

  const addToWatchlist = async (coin) => {
    console.log('Adding coin to watchlist:', coin);
    console.log('Coin properties:', Object.keys(coin));
    
    // Check if coin has required properties
    if (!coin.id || !coin.name || !coin.symbol) {
      console.error('Coin object missing required properties:', coin);
      toast.error('Failed to add to watchlist: Missing coin data');
      return;
    }
    
    const result = await addWatchlistItem(coin);  // Pass the full coin object instead of creating a new one
    
    console.log('Add to watchlist result:', result);
    if (result.success) {
      toast.success(`${coin.symbol.toUpperCase()} added to watchlist`);
    } else {
      toast.error(result.error || 'Failed to add to watchlist');
    }
  };

  const removeFromWatchlist = async (coinId) => {
    console.log('Removing coin from watchlist in Dashboard:', coinId);
    const result = await removeWatchlistItem(coinId);
    
    console.log('Remove from watchlist result:', result);
    if (result.success) {
      toast.success('Removed from watchlist');
    } else {
      toast.error(result.error || 'Failed to remove from watchlist');
    }
  };

  // Fetch watchlist on component mount
  useEffect(() => {
    console.log('Fetching watchlist...');
    fetchWatchlist();
  }, []);
  
  // Log watchlist updates
  useEffect(() => {
    console.log('Watchlist updated:', watchlist);
  }, [watchlist]);

  // Handle watchlist errors
  useEffect(() => {
    if (watchlistError) {
      toast.error(watchlistError);
    }
  }, [watchlistError]);

  const handleLogout = () => {
    logout();
    // Don't navigate here, let ProtectedRoute handle it
  };

  const getLivePrice = (coinId) => {
    const coin = coins.find((c) => c.id === coinId);
    if (!coin) return null;
    const symbol = coin.symbol.toLowerCase();
    const wsPrice = wsPrices[symbol];
    if (wsPrice && wsPrice.price !== undefined && wsPrice.price !== null) {
      return {
        price: wsPrice.price,
        change1h: (wsPrice.change1h !== undefined && wsPrice.change1h !== null) ? wsPrice.change1h : coin.price_change_percentage_1h,
        change24h: (wsPrice.change24h !== undefined && wsPrice.change24h !== null) ? wsPrice.change24h : coin.price_change_percentage_24h,
        change7d: coin.price_change_percentage_7d,
      };
    }
    return {
      price: (coin.current_price !== undefined && coin.current_price !== null) ? coin.current_price : 0,
      change1h: (coin.price_change_percentage_1h !== undefined && coin.price_change_percentage_1h !== null) ? coin.price_change_percentage_1h : 0,
      change24h: (coin.price_change_percentage_24h !== undefined && coin.price_change_percentage_24h !== null) ? coin.price_change_percentage_24h : 0,
      change7d: (coin.price_change_percentage_7d !== undefined && coin.price_change_percentage_7d !== null) ? coin.price_change_percentage_7d : 0,
    };
  };

  // Format large numbers
  const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) {
      return 'N/A';
    }
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
    if (supply === null || supply === undefined || isNaN(supply)) {
      return 'N/A';
    }
    if (supply >= 1000000000) {
      return (supply / 1000000000).toFixed(2) + 'B';
    }
    if (supply >= 1000000) {
      return (supply / 1000000).toFixed(2) + 'M';
    }
    if (supply >= 1000) {
      return (supply / 1000).toFixed(2) + 'K';
    }
    return supply.toLocaleString();
  };

  // Get currency symbol
  const getCurrencySymbol = () => {
    // Always return USD symbol
    return '$';
  };

  // Convert price to selected currency
  const convertPriceToCurrency = (price) => {
    // No conversion needed as we're using USD only
    return price;
  };

  // Get currency formatter
  const getCurrencyFormatter = () => {
    // Always use USD formatter
    return 'en-US';
  };

  // Sort coins
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Log sorted and filtered coins
  useEffect(() => {
    console.log('Sorted and filtered coins updated:', sortedAndFilteredCoins.length);
  }, [sortedAndFilteredCoins.length]);

  // Listen for currency changes
  useEffect(() => {
    const handleCurrencyChange = () => {
      console.log('Currency change detected, refetching coins...');
      // Refetch coins when currency changes
      refetch();
    };

    window.addEventListener('currencyChange', handleCurrencyChange);
    return () => {
      console.log('Removing currency change listener');
      window.removeEventListener('currencyChange', handleCurrencyChange);
    };
  }, [refetch]);

  // Load more coins
  /*const loadMoreCoins = () => {
    const nextPage = page + 1;
    const startIndex = page * coinsPerPage;
    const endIndex = startIndex + coinsPerPage;
    const newCoins = sortedAndFilteredCoins.slice(startIndex, endIndex);
    
    console.log('Loading more coins:', newCoins.length, 'from index', startIndex, 'to', endIndex);
    console.log('Current displayed coins count:', displayedCoins.length);
    
    if (newCoins.length > 0) {
      setDisplayedCoins(prev => [...prev, ...newCoins]);
      setPage(nextPage);
      console.log('Updated displayed coins count:', displayedCoins.length + newCoins.length);
    } else {
      console.log('No more coins to load');
    }
  };*/

  // Render coin row (for both desktop and mobile)
  const renderCoinRow = (coin, index, isMobile = false) => {
    // Check if coin is in watchlist
    const isInWatchlist = watchlist?.some(item => item.coinId === coin.id);
    
    // Get live price from WebSocket if available
    const livePrice = getLivePrice(coin.id);
    const price = livePrice?.price || coin.current_price;
    const change1h = livePrice?.change1h !== undefined ? livePrice.change1h : coin.price_change_percentage_1h;
    const change24h = livePrice?.change24h !== undefined ? livePrice.change24h : coin.price_change_percentage_24h;
    const change7d = livePrice?.change7d !== undefined ? livePrice.change7d : coin.price_change_percentage_7d;
    
    const isPositive1h = change1h >= 0;
    const isPositive24h = change24h >= 0;
    const isPositive7d = change7d >= 0;
    
    // Sparkline data for chart
    const sparklineData = coin.sparkline_in_7d?.price?.map((price, i) => ({
      value: price,
    })) || [];
    
    // Get proper image URL
    const imageUrl = getImageUrl(coin);
    
    if (!isMobile) {
      // Desktop table row
      return (
        <tr 
          key={coin.id} 
          className="hover:bg-[#19191c]/50 cursor-pointer"
          onClick={() => navigate(`/coin/${coin.id}`)}
        >
          <td className="px-4 py-3 text-lg text-gray-400">{index + 1}</td>
          <td className="px-4 py-3">
            <div className="flex items-center">
              <img 
                src={imageUrl} 
                alt={coin.name} 
                className="h-8 w-8 rounded-full"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/32/19191c/FFFFFF?text=' + coin.symbol.toUpperCase();
                }}
              />
              <div className="ml-3">
                <div className="text-lg font-medium text-white">{coin.name}</div>
                <div className="text-lg text-gray-400">{coin.symbol.toUpperCase()}</div>
              </div>
            </div>
          </td>
          <td className="px-4 py-3 text-lg text-right text-white">
            {price !== null && price !== undefined ? getCurrencySymbol() + price.toLocaleString(getCurrencyFormatter(), { maximumFractionDigits: 2 }) : 'N/A'}
          </td>
          <td className={`px-4 py-3 text-lg text-right ${isPositive1h ? 'text-green-500' : 'text-red-500'}`}>
            {change1h !== null && change1h !== undefined && !isNaN(change1h) ? (isPositive1h ? '+' : '') + change1h.toFixed(2) + '%' : 'N/A'}
          </td>
          <td className={`px-4 py-3 text-lg text-right ${isPositive24h ? 'text-green-500' : 'text-red-500'}`}>
            {change24h !== null && change24h !== undefined && !isNaN(change24h) ? (isPositive24h ? '+' : '') + change24h.toFixed(2) + '%' : 'N/A'}
          </td>
          <td className={`px-4 py-3 text-lg text-right ${isPositive7d ? 'text-green-500' : 'text-red-500'}`}>
            {change7d !== null && change7d !== undefined && !isNaN(change7d) ? (isPositive7d ? '+' : '') + change7d.toFixed(2) + '%' : 'N/A'}
          </td>
          <td className="px-4 py-3 text-lg text-right text-white">
            {coin.market_cap !== null && coin.market_cap !== undefined && !isNaN(coin.market_cap) ? getCurrencySymbol() + formatNumber(coin.market_cap) : 'N/A'}
          </td>
          <td className="px-4 py-3 text-lg text-right text-white">
            {coin.total_volume !== null && coin.total_volume !== undefined && !isNaN(coin.total_volume) ? getCurrencySymbol() + formatNumber(coin.total_volume) : 'N/A'}
          </td>
          <td className="px-4 py-3 text-lg text-right text-white">
            {coin.circulating_supply !== null && coin.circulating_supply !== undefined && !isNaN(coin.circulating_supply) ? formatSupply(coin.circulating_supply) + ' ' + coin.symbol.toUpperCase() : 'N/A'}
          </td>
          <td className="px-4 py-3 text-lg">
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
          <td className="px-4 py-3 text-lg text-right">
            <button
              onClick={async (e) => {
                e.stopPropagation();
                console.log('Coin object being passed:', coin);
                
                // Validate coin object before adding to watchlist
                if (!coin.id || !coin.name || !coin.symbol) {
                  toast.error('Invalid coin data');
                  return;
                }
                
                if (isInWatchlist) {
                  const result = await removeWatchlistItem(coin.id);
                  if (result.success) {
                    toast.success('Removed from watchlist');
                  } else {
                    toast.error(result.error || 'Failed to remove from watchlist');
                  }
                } else {
                  const result = await addWatchlistItem(coin);
                  if (result.success) {
                    toast.success(`${coin.name} added to watchlist!`);
                  } else {
                    toast.error(result.error || 'Failed to add to watchlist');
                  }
                }
              }}
              className={`p-2 rounded-full ${isInWatchlist ? 'text-yellow-500 bg-yellow-500/20' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/20'}`}
            >
              <Star className="h-5 w-5" fill={isInWatchlist ? 'currentColor' : 'none'} />
            </button>
          </td>
        </tr>
      );
    }
    
    // Mobile card
    return (
      <div 
        key={coin.id} 
        className="glass-card rounded-xl p-4 border border-white/10 hover:border-orange-500/50 transition-all cursor-pointer"
        onClick={() => navigate(`/coin/${coin.id}`)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-gray-400 text-xl">{index + 1}</span>
            <img 
              src={imageUrl} 
              alt={coin.name} 
              className="h-10 w-10 rounded-full"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/40/19191c/FFFFFF?text=' + coin.symbol.toUpperCase();
              }}
            />
            <div>
              <h3 className="font-semibold text-white text-xl">{coin.name}</h3>
              <p className="text-lg text-gray-400">{coin.symbol.toUpperCase()}</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold text-white">
              {price !== null && price !== undefined ? getCurrencySymbol() + price.toLocaleString(getCurrencyFormatter(), { maximumFractionDigits: 2 }) : 'N/A'}
            </p>
            <div className={`flex items-center justify-end ${isPositive24h ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive24h ? (
                <TrendingUp className="h-4 w-4 inline mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 inline mr-1" />
              )}
              <span className="font-medium text-lg">
                {change24h !== null && change24h !== undefined && !isNaN(change24h) ? (isPositive24h ? '+' : '') + change24h.toFixed(2) + '%' : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      
        <div className="grid grid-cols-2 gap-2 mt-3 text-lg">
          <div>
            <p className="text-gray-400">1h</p>
            <p className={isPositive1h ? 'text-green-500' : 'text-red-500'}>
              {change1h !== null && change1h !== undefined && !isNaN(change1h) ? (isPositive1h ? '+' : '') + change1h.toFixed(2) + '%' : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-gray-400">7d</p>
            <p className={isPositive7d ? 'text-green-500' : 'text-red-500'}>
              {change7d !== null && change7d !== undefined && !isNaN(change7d) ? (isPositive7d ? '+' : '') + change7d.toFixed(2) + '%' : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Market Cap</p>
            <p className="text-white">{coin.market_cap !== null && coin.market_cap !== undefined && !isNaN(coin.market_cap) ? getCurrencySymbol() + formatNumber(coin.market_cap) : 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-400">Volume</p>
            <p className="text-white">{coin.total_volume !== null && coin.total_volume !== undefined && !isNaN(coin.total_volume) ? getCurrencySymbol() + formatNumber(coin.total_volume) : 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-400">Supply</p>
            <p className="text-white">{coin.circulating_supply !== null && coin.circulating_supply !== undefined && !isNaN(coin.circulating_supply) ? formatSupply(coin.circulating_supply) + ' ' + coin.symbol.toUpperCase() : 'N/A'}</p>
          </div>
        </div>
      
        <div className="mt-3">
          <p className="text-gray-400 text-lg">Last 7 Days</p>
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
            onClick={async (e) => {
              e.stopPropagation();
              console.log('Coin object being passed (mobile):', coin);
              
              // Validate coin object before adding to watchlist
              if (!coin.id || !coin.name || !coin.symbol) {
                toast.error('Invalid coin data');
                return;
              }
              
              if (isInWatchlist) {
                const result = await removeWatchlistItem(coin.id);
                if (result.success) {
                  toast.success('Removed from watchlist');
                } else {
                  toast.error(result.error || 'Failed to remove from watchlist');
                }
              } else {
                const result = await addWatchlistItem(coin);
                if (result.success) {
                  toast.success(`${coin.name} added to watchlist!`);
                } else {
                  toast.error(result.error || 'Failed to add to watchlist');
                }
              }
            }}
            className={`p-2 rounded-full ${isInWatchlist ? 'text-yellow-500 bg-yellow-500/20' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/20'}`}
          >
            <Star className="h-5 w-5" fill={isInWatchlist ? 'currentColor' : 'none'} />
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
          {/* Coin List Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6 px-4 md:px-6">
              <h2 className="text-4xl font-bold text-white">Top Cryptocurrencies</h2>
              <div className="text-xl text-gray-400">
                Showing {displayedCoins.length} of {sortedAndFilteredCoins.length} coins
              </div>
            </div>
            
            {/* Search Bar and Filters */}
            <div className="mb-6 px-4 md:px-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search cryptocurrencies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xl"
                  />
                </div>
                
                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                  {/* Price Change Filter */}
                  <select 
                    className="bg-white/5 border border-white/10 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xl"
                    value={priceChangeFilter}
                    onChange={(e) => setPriceChangeFilter(e.target.value)}
                  >
                    <option value="all">All Changes</option>
                    <option value="gainers">Gainers (24h)</option>
                    <option value="losers">Losers (24h)</option>
                  </select>
                  
                  {/* Market Cap Filter */}
                  <select 
                    className="bg-white/5 border border-white/10 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xl"
                    value={marketCapFilter}
                    onChange={(e) => setMarketCapFilter(e.target.value)}
                  >
                    <option value="all">All Market Caps</option>
                    <option value="large">Large Cap</option>
                    <option value="mid">Mid Cap</option>
                    <option value="small">Small Cap</option>
                  </select>
                </div>
              </div>
            </div>
          
            {apiLoading && displayedCoins.length === 0 ? (
              <div className="space-y-4 px-4 md:px-6">
                {[...Array(10)].map((_, i) => (
                  <SkeletonLoader key={i} className="h-16" />
                ))}
              </div>
            ) : apiError && displayedCoins.length === 0 ? (
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
            ) : (
              <div className="space-y-4 px-0 md:px-0">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-base font-medium text-gray-400 uppercase tracking-wider">#</th>
                        <th className="px-6 py-3 text-left text-base font-medium text-gray-400 uppercase tracking-wider">Coin</th>
                        <th 
                          className="px-6 py-3 text-right text-base font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
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
                          className="px-6 py-3 text-right text-base font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
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
                          className="px-6 py-3 text-right text-base font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
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
                          className="px-6 py-3 text-right text-base font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
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
                          className="px-6 py-3 text-right text-base font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
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
                          className="px-6 py-3 text-right text-base font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                          onClick={() => requestSort('total_volume')}
                        >
                          <div className="flex items-center justify-end">
                            Volume(24h)
                            {sortConfig.key === 'total_volume' && (
                              sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-right text-base font-medium text-gray-400 uppercase tracking-wider">Circulating Supply</th>
                        <th className="px-6 py-3 text-right text-base font-medium text-gray-400 uppercase tracking-wider">Last 7 Days</th>
                        <th className="px-6 py-3 text-right text-base font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {displayedCoins.map((coin, index) => renderCoinRow(coin, index))}
                    </tbody>
                  </table>
                </div>
              
                {/* Mobile List */}
                <div className="md:hidden space-y-4 px-4 md:px-6">
                  {displayedCoins.map((coin, index) => renderCoinRow(coin, index, true))}
                </div>
              
                {/* Remove the View More button since we're showing all coins */}
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

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
