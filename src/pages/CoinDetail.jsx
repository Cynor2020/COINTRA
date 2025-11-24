import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAlerts } from '../hooks/useAlerts';
import { useWatchlist } from '../hooks/useWatchlist';
import { getCoinById, getCoinMarketChart, getCoinMarketChartRange, getRelatedCoins, getCoinMarketChart7d } from '../services/coingecko';
import { 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  ArrowUp, 
  ArrowDown,
  X,
  Sparkles,
  Home,
  Star,
  LogOut
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import axios from 'axios';
import toast from 'react-hot-toast';
// CurrencySelector removed as we only support USD

// Get currency symbol
const getCurrencySymbol = () => {
  // Always return USD symbol as we only support USD
  return '$';
};

// Format large numbers
const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) {
    return 'N/A';
  }
  if (num >= 1000000000000) {
    return (num / 1000000000000).toFixed(2) + 'T';
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

// Format percentage
const formatPercentage = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  return (value >= 0 ? '+' : '') + value.toFixed(2) + '%';
};

// Format date
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Format time
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get time range in seconds
const getTimeRange = (range) => {
  const now = Math.floor(Date.now() / 1000);
  switch (range) {
    case '1H': return { from: now - 3600, to: now };
    case '24H': return { from: now - 86400, to: now };
    case '7D': return { from: now - 604800, to: now };
    case '30D': return { from: now - 2592000, to: now };
    case '1Y': return { from: now - 31536000, to: now };
    case 'ALL': return { from: now - 315360000, to: now }; // 10 years
    default: return { from: now - 604800, to: now }; // 7D default
  }
};

// Generate mock candlestick data
const generateMockCandlestickData = (coinId, range) => {
  const { from, to } = getTimeRange(range);
  const data = [];
  const interval = (to - from) / 100; // 100 data points
  const basePrice = coinId === 'bitcoin' ? 45000 : coinId === 'ethereum' ? 3200 : 100;
  
  for (let i = 0; i < 100; i++) {
    const timestamp = (from + i * interval) * 1000;
    const open = basePrice + (Math.random() - 0.5) * basePrice * 0.1;
    const close = open + (Math.random() - 0.5) * open * 0.05;
    const high = Math.max(open, close) + Math.random() * open * 0.02;
    const low = Math.min(open, close) - Math.random() * open * 0.02;
    const volume = Math.random() * 1000000000;
    
    data.push({
      timestamp,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: parseFloat(volume.toFixed(2))
    });
  }
  
  return data;
};

// Convert coin symbol to CryptoPanic currency code
const getCurrencyCode = (coinId) => {
  const currencyMap = {
    'bitcoin': 'BTC',
    'ethereum': 'ETH',
    'binancecoin': 'BNB',
    'solana': 'SOL',
    'ripple': 'XRP',
    'cardano': 'ADA',
    'dogecoin': 'DOGE',
    'polygon': 'MATIC',
    'polkadot': 'DOT',
    'litecoin': 'LTC'
  };
  return currencyMap[coinId] || coinId.toUpperCase();
};

// Enhanced Skeleton Loader for Coin Detail
const CoinDetailSkeleton = () => (
  <div className="min-h-screen bg-[#0f172a] text-white">
    {/* Background effects */}
    <div className="fixed inset-0 bg-gradient-to-br from-[#0f172a]/90 via-[#0a0e17] to-[#0f172a]/90 pointer-events-none" />
    <div className="fixed top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
    <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

    {/* Header Skeleton */}
    <header className="sticky top-0 z-[100] bg-[#0f172a]/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-none mx-0 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center space-x-4">
            <div className="rounded bg-white/10 h-8 w-8" />
            <div className="rounded bg-white/10 h-12 w-32" />
          </div>
          <div className="hidden md:flex md:items-center md:space-x-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded bg-white/10 h-6 w-24" />
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-white/10 h-6 w-6" />
            <div className="flex items-center space-x-3">
              <div className="rounded bg-white/10 h-6 w-16" />
              <div className="rounded bg-white/10 h-8 w-20" />
            </div>
          </div>
        </div>
      </div>
    </header>

    <div className="relative z-10 max-w-none mx-0 px-0 py-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Panel Skeleton */}
        <div className="lg:col-span-3">
          <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl bg-white/5 shadow-xl shadow-orange-500/10 hover:shadow-orange-500/20 transition-all h-full m-4 md:m-6">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded bg-white/10 h-6 w-40" />
              <div className="rounded bg-white/10 h-6 w-6" />
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gradient-to-r from-white/10 to-white/5 p-4 rounded-xl border border-white/10">
                  <div className="rounded bg-white/10 h-4 w-24 mb-2" />
                  <div className="flex items-center justify-between mt-1">
                    <div className="rounded bg-white/10 h-6 w-16" />
                    <div className="rounded bg-white/10 h-6 w-24" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="rounded bg-white/10 h-4 w-full" />
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content Skeleton */}
        <div className="lg:col-span-6">
          {/* Chart Section Skeleton */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl bg-white/5 shadow-xl m-4 md:m-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <div className="rounded bg-white/10 h-8 w-48 mb-2" />
                <div className="flex items-center mt-1">
                  <div className="rounded bg-white/10 h-8 w-32" />
                  <div className="ml-3 rounded bg-white/10 h-6 w-16" />
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex flex-wrap gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="rounded bg-white/10 h-8 w-12" />
                  ))}
                </div>
              </div>
            </div>
            <div className="h-96 min-h-96 bg-white/5 rounded-xl animate-pulse" />
          </div>
          
          {/* Set Price Alert Skeleton */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl bg-white/5 shadow-xl m-4 md:m-6">
            <div className="rounded bg-white/10 h-6 w-32 mb-4" />
            <div className="space-y-4">
              <div className="rounded bg-white/10 h-4 w-48" />
              <div className="rounded bg-white/10 h-12 w-full" />
              <div className="rounded bg-white/10 h-12 w-full" />
            </div>
          </div>
          
          {/* News Section Skeleton */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl bg-white/5 shadow-xl m-4 md:m-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="rounded bg-white/10 h-6 w-32" />
              <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="rounded bg-white/10 h-8 w-16" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card p-4 rounded-xl border border-white/10">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="rounded bg-white/10 h-32 w-full md:w-32" />
                    <div className="flex-1">
                      <div className="rounded bg-white/10 h-6 w-full mb-2" />
                      <div className="rounded bg-white/10 h-6 w-3/4 mb-4" />
                      <div className="flex justify-between items-center text-sm">
                        <div className="rounded bg-white/10 h-4 w-24" />
                        <div className="rounded bg-white/10 h-4 w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Panel Skeleton */}
        <div className="lg:col-span-3">
          <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl bg-white/5 shadow-xl m-4 md:m-6">
            <div className="rounded bg-white/10 h-6 w-32 mb-6" />
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-3 bg-white/5 rounded-lg">
                  <div className="rounded bg-white/10 h-4 w-24 mb-2" />
                  <div className="rounded bg-white/10 h-6 w-32" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function CoinDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [timeRange, setTimeRange] = useState('7D');
  const [chartData, setChartData] = useState([]);
  const [candlestickData, setCandlestickData] = useState([]);
  const [news, setNews] = useState([]);
  const [alertPrice, setAlertPrice] = useState('');
  const [isAlertSet, setIsAlertSet] = useState(false);
  const [livePrice, setLivePrice] = useState(null);
  const [priceChange, setPriceChange] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [relatedCoins, setRelatedCoins] = useState([]);
  const [relatedCoinsChart, setRelatedCoinsChart] = useState({});
  const priceFlashRef = useRef(null);
  const audioRef = useRef(null);
  const chartRef = useRef(null);

  // Check if coin is in watchlist
  const isInWatchlist = watchlist?.some(item => item.coinId === id);

  // Fetch coin data
  const { data: coin, isLoading, error } = useQuery({
    queryKey: ['coin', id],
    queryFn: () => getCoinById(id),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000, // Consider data fresh for 15 seconds
    retry: 2
  });

  // Fetch chart data
  const { data: chartResponse, isLoading: isChartLoading } = useQuery({
    queryKey: ['chart', id, timeRange],
    queryFn: async () => {
      const { from, to } = getTimeRange(timeRange);
      return getCoinMarketChartRange(id, from, to);
    },
    refetchInterval: 10000, // Refetch every 10 seconds (increased frequency)
    staleTime: 5000, // Consider data fresh for 5 seconds (reduced)
    retry: 2
  });

  // Fetch related coins
  const { data: relatedCoinsData, isLoading: relatedCoinsLoading, error: relatedCoinsError } = useQuery({
    queryKey: ['relatedCoins', id],
    queryFn: () => getRelatedCoins(id),
    staleTime: 300000, // 5 minutes
    retry: 2
  });

  // Set related coins when data is fetched
  useEffect(() => {
    if (relatedCoinsData) {
      console.log('Setting related coins:', relatedCoinsData);
      setRelatedCoins(relatedCoinsData);
    }
    
    if (relatedCoinsError) {
      console.error('Error fetching related coins:', relatedCoinsError);
    }
  }, [relatedCoinsData, relatedCoinsError]);

  // Fetch 7-day chart data for related coins
  useEffect(() => {
    if (relatedCoinsData && relatedCoinsData.length > 0) {
      setRelatedCoins(relatedCoinsData);
      
      // Fetch chart data for each related coin
      const fetchRelatedCoinsChart = async () => {
        const chartData = {};
        for (const coin of relatedCoinsData) {
          try {
            const data = await getCoinMarketChart7d(coin.id);
            chartData[coin.id] = data.prices.map(([timestamp, price]) => ({
              timestamp,
              price
            }));
          } catch (error) {
            console.error(`Error fetching chart for ${coin.id}:`, error);
            // Generate mock data if API fails
            const mockData = [];
            const now = Date.now();
            for (let i = 6; i >= 0; i--) {
              const timestamp = now - (i * 24 * 60 * 60 * 1000);
              const basePrice = coin.current_price || Math.random() * 1000 + 100;
              const variation = (Math.random() - 0.5) * basePrice * 0.1;
              const price = basePrice + variation;
              mockData.push({
                timestamp,
                price
              });
            }
            chartData[coin.id] = mockData;
          }
        }
        setRelatedCoinsChart(chartData);
      };
      
      fetchRelatedCoinsChart();
    }
  }, [relatedCoinsData]);

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const currencyCode = getCurrencyCode(id);
        // Try to fetch from CryptoPanic API
        const response = await axios.get(
          `https://cryptopanic.com/api/v1/posts/?auth_token=54454b9dc326de58d5a9d8116a679d05e5f02d84&currencies=${currencyCode}&kind=news&public=true`,
          { timeout: 5000 } // 5 second timeout
        );
        // Add mock images if not available
        const newsWithImages = response.data.results.slice(0, 6).map(article => ({
          ...article,
          thumbnail: article.thumbnail || `https://picsum.photos/400/200?random=${article.id}`
        }));
        setNews(newsWithImages); // Get first 6 news items
      } catch (error) {
        console.error('Error fetching news:', error);
        // If CryptoPanic fails, use mock news data with images
        setNews([
          {
            id: 1,
            title: "Major Exchange Lists New Cryptocurrency",
            source: { name: "CryptoNews" },
            created_at: new Date().toISOString(),
            url: "#",
            thumbnail: "https://picsum.photos/400/200?random=1"
          },
          {
            id: 2,
            title: "Regulatory Changes Impact Crypto Market",
            source: { name: "CoinDesk" },
            created_at: new Date().toISOString(),
            url: "#",
            thumbnail: "https://picsum.photos/400/200?random=2"
          },
          {
            id: 3,
            title: "New Technology Breakthrough in Blockchain",
            source: { name: "CryptoBriefing" },
            created_at: new Date().toISOString(),
            url: "#",
            thumbnail: "https://picsum.photos/400/200?random=3"
          },
          {
            id: 4,
            title: "Institutional Adoption Reaches New Heights",
            source: { name: "CoinTelegraph" },
            created_at: new Date().toISOString(),
            url: "#",
            thumbnail: "https://picsum.photos/400/200?random=4"
          },
          {
            id: 5,
            title: "Market Analysis: Bull Run Predictions",
            source: { name: "CryptoSlate" },
            created_at: new Date().toISOString(),
            url: "#",
            thumbnail: "https://picsum.photos/400/200?random=5"
          },
          {
            id: 6,
            title: "Security Enhancement in Major Wallet Provider",
            source: { name: "Decrypt" },
            created_at: new Date().toISOString(),
            url: "#",
            thumbnail: "https://picsum.photos/400/200?random=6"
          }
        ]);
      }
    };

    fetchNews();
  }, [id]);

  // Process chart data when it changes
  useEffect(() => {
    if (chartResponse && chartResponse.prices) {
      const formattedData = chartResponse.prices.map(([timestamp, price]) => ({
        timestamp,
        price: parseFloat(price.toFixed(2))
      }));
      setChartData(formattedData);
      
      // Generate mock candlestick data
      const mockCandlestick = generateMockCandlestickData(id, timeRange);
      setCandlestickData(mockCandlestick);
      
      // Set live price to the last price
      if (formattedData.length > 0) {
        const lastPrice = formattedData[formattedData.length - 1].price;
        setLivePrice(lastPrice);
        
        // Calculate price change (mock)
        if (formattedData.length > 1) {
          const previousPrice = formattedData[formattedData.length - 2].price;
          const change = ((lastPrice - previousPrice) / previousPrice) * 100;
          setPriceChange(change);
        }
      }
    }
  }, [chartResponse, id, timeRange]);

  // Simulate live price updates every 1 second (increased frequency)
  useEffect(() => {
    const interval = setInterval(() => {
      if (coin && coin.market_data) {
        const currentPrice = coin.market_data.current_price?.usd || 0;
        // Add a small random fluctuation to simulate live updates
        const fluctuation = (Math.random() - 0.5) * 0.005 * currentPrice; // Reduced fluctuation for more realistic updates
        const newPrice = currentPrice + fluctuation;
        const newChange = (newPrice - currentPrice) / currentPrice * 100;
        
        setLivePrice(newPrice);
        setPriceChange(newChange);
        setLastUpdated(Date.now());
        
        // Trigger price flash animation
        if (priceFlashRef.current) {
          priceFlashRef.current.classList.remove('price-flash');
          void priceFlashRef.current.offsetWidth; // Trigger reflow
          priceFlashRef.current.classList.add('price-flash');
        }
        
        // Animate chart
        if (chartRef.current) {
          // This will trigger a re-render of the chart with new data
          setChartData(prevData => {
            if (prevData.length > 0) {
              const newData = [...prevData];
              const lastPoint = newData[newData.length - 1];
              newData.push({
                timestamp: Date.now(),
                price: newPrice
              });
              // Keep only the last 100 points
              if (newData.length > 100) {
                newData.shift();
              }
              return newData;
            }
            return prevData;
          });
        }
      }
    }, 1000); // Update every 1 second (increased frequency from 5 seconds)

    return () => clearInterval(interval);
  }, [coin]);

  // Check price alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (livePrice && alertPrice) {
        const targetPrice = parseFloat(alertPrice);
        if (!isNaN(targetPrice)) {
          // Check if current price matches or exceeds target price
          if (
            (targetPrice > 0 && livePrice >= targetPrice) ||
            (targetPrice < 0 && livePrice <= Math.abs(targetPrice))
          ) {
            // Trigger alert
            const notification = {
              id: Date.now(),
              message: `Price alert: ${coin?.name || id} reached $${livePrice.toLocaleString()}`,
              time: new Date().toLocaleTimeString()
            };
            
            // Add to notifications - will be handled by backend in future
            // For now, we'll just show the toast notification
            
            // Show toast notification
            toast.success(`Price alert triggered for ${coin?.name || id} at $${livePrice.toLocaleString()}`, {
              duration: 5000,
              icon: '🔔'
            });
            
            // Play sound
            try {
              const audio = new Audio('/sounds/notification.mp3');
              audio.play().catch(e => console.log('Audio play failed:', e));
            } catch (e) {
              console.log('Audio play failed:', e);
              // Fallback to base64 audio
              try {
                const fallbackAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFfHd5eXp9gIePl5uZl5WTkZCPkZWXmZqcnJ2en6Cio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/wABAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICEiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/gIGCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8A');
                fallbackAudio.play().catch(e => console.log('Fallback audio play failed:', e));
              } catch (e2) {
                console.log('Fallback audio also failed:', e2);
              }
            }
            
            // Reset alert
            setAlertPrice('');
            setIsAlertSet(false);
          }
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [livePrice, alertPrice, coin, id]);

  const { createAlert } = useAlerts();
  
  // Handle set alert
  const handleSetAlert = async () => {
    if (alertPrice && !isNaN(parseFloat(alertPrice))) {
      const result = await createAlert({
        coinId: id,
        coinName: coin?.name || id,
        targetPrice: parseFloat(alertPrice)
      });
      
      if (result.success) {
        setIsAlertSet(true);
        toast.success('Price alert set successfully!');
      } else {
        toast.error(result.error || 'Failed to set price alert');
      }
    } else {
      toast.error('Please enter a valid price');
    }
  };

  // Handle clear alert
  const handleClearAlert = () => {
    setAlertPrice('');
    setIsAlertSet(false);
  };

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

  // Handle add to watchlist
  const handleAddToWatchlist = async () => {
    if (!coin) return;
    
    // Validate coin object
    if (!coin.id || !coin.name || !coin.symbol) {
      toast.error('Invalid coin data');
      return;
    }
    
    // Create a coin object with proper image URL
    const coinWithImageUrl = {
      ...coin,
      image: getImageUrl(coin)
    };
    
    if (isInWatchlist) {
      const result = await removeFromWatchlist(coin.id);
      if (result.success) {
        toast.success('Removed from watchlist');
      } else {
        toast.error(result.error || 'Failed to remove from watchlist');
      }
    } else {
      const result = await addToWatchlist(coinWithImageUrl);
      if (result.success) {
        toast.success(`${coin.name} added to watchlist!`);
      } else {
        toast.error(result.error || 'Failed to add to watchlist');
      }
    }
  };

  if (isLoading) {
    return <CoinDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-white text-xl">
          <p>Error loading coin data: {error.message}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-white text-xl">Coin not found</div>
      </div>
    );
  }

  // Extract market data
  const marketData = coin.market_data || {};
  const currentPrice = marketData.current_price?.usd || 0;
  const priceChange24h = marketData.price_change_percentage_24h || 0;
  const priceChange7d = marketData.price_change_percentage_7d || 0;
  const priceChange30d = marketData.price_change_percentage_30d || 0;
  const marketCap = marketData.market_cap?.usd || 0;
  const volume24h = marketData.total_volume?.usd || 0;
  const circulatingSupply = marketData.circulating_supply || 0;
  const maxSupply = marketData.max_supply || marketData.total_supply || 0;
  const ath = marketData.ath?.usd || 0;
  const atl = marketData.atl?.usd || 0;
  const athDate = marketData.ath_date?.inr || marketData.ath_date?.usd || '';
  const atlDate = marketData.atl_date?.inr || marketData.atl_date?.usd || '';
  const fdv = marketData.fully_diluted_valuation?.usd || 0;

  // Calculate ATH and ATL changes
  const athChange = marketData.ath_change_percentage?.usd || 0;
  const atlChange = marketData.atl_change_percentage?.usd || 0;

  // AI Questions related to the current coin
  const aiQuestions = [
    `What is ${coin?.name || 'this coin'} and its key features?`,
    `What is the current price and market cap of ${coin?.name || 'this coin'}?`,
    `What are the recent price trends for ${coin?.name || 'this coin'}?`,
    `What are the technical indicators for ${coin?.name || 'this coin'}?`,
    `What is the community sentiment about ${coin?.name || 'this coin'}?`
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0f172a]/90 via-[#0a0e17] to-[#0f172a]/90 pointer-events-none" />
      <div className="fixed top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Dashboard Header */}
      <header className="sticky top-0 z-[100] bg-[#0f172a]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-none mx-0 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-300 hover:text-orange-500 transition-colors mr-4"
              >
                <ArrowUp className="rotate-90 mr-2" size={20} />
              </button>
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
              <Link to="/dashboard" className="flex items-center gap-2 text-orange-500 font-medium">
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

            {/* Right side - Notification Bell, Currency Selector and Auth */}
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => navigate('/alerts')}
                  className="relative p-2 text-gray-300 hover:text-orange-500 transition-colors"
                >
                  <Bell size={20} />
                  {/* Bell badge - will be updated with real notification count */}
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    0
                  </span>
                </button>
              </div>

              {/* Watchlist Button */}
              <button
                onClick={handleAddToWatchlist}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-white transition-colors ${
                  isInWatchlist 
                    ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <Star className="h-4 w-4" fill={isInWatchlist ? 'currentColor' : 'none'} />
                <span className="hidden md:inline">
                  {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </span>
              </button>

              {/* CurrencySelector removed as we only support USD */}
            
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-white font-medium">
                  User
                </div>
                <button
                  className="flex items-center space-x-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-none mx-0 px-0 py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Panel - COINTRA AI Prediction */}
          <div className="lg:col-span-3">
            <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl bg-white/5 shadow-xl shadow-orange-500/10 hover:shadow-orange-500/20 transition-all h-full m-4 md:m-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-orange-500">COINTRA AI Prediction</h2>
                <Sparkles className="text-orange-500" size={24} />
              </div>
              
              <div className="space-y-4">
                {/* 24H Prediction */}
                <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 p-4 rounded-xl border border-orange-500/30">
                  <div className="text-sm text-gray-300">Next 24H</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-lg font-bold text-green-400">62% Up</span>
                    <span className="text-lg font-bold">Target: $44,850</span>
                  </div>
                </div>
                
                {/* 7D Prediction */}
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-600/20 p-4 rounded-xl border border-cyan-500/30">
                  <div className="text-sm text-gray-300">Next 7D</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-lg font-bold text-green-400">Bullish</span>
                    <span className="text-lg font-bold">Confidence: High</span>
                  </div>
                </div>
                
                {/* Risk Level */}
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-600/20 p-4 rounded-xl border border-purple-500/30">
                  <div className="text-sm text-gray-300">Risk Level</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-bold">
                      Medium
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-sm text-gray-400">
                <p>AI predictions are based on technical analysis, market sentiment, and historical patterns.</p>
              </div>
              
              {/* People Also Ask Section */}
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-3 text-orange-500">People Also Ask</h3>
                <div className="space-y-2">
                  {aiQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => navigate('/ai', { state: { question } })}
                      className="w-full text-left p-3 bg-white/5 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* People Also Viewed Section - Moved here from middle column */}
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-3 text-orange-500">People Also Viewed</h3>
                <div className="space-y-3">
                  {console.log('Rendering related coins:', relatedCoins)}
                  {relatedCoins.slice(0, 3).map((relatedCoin) => (
                    <div 
                      key={relatedCoin.id}
                      className="flex items-center p-2 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-all"
                      onClick={() => navigate(`/coin/${relatedCoin.id}`)}
                    >
                      <img 
                        src={relatedCoin.image} 
                        alt={relatedCoin.name} 
                        className="h-8 w-8 rounded-full"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/32/19191c/FFFFFF?text=' + relatedCoin.symbol.toUpperCase();
                        }}
                      />
                      <div className="ml-2 flex-1">
                        <h4 className="text-sm font-medium text-white">{relatedCoin.name}</h4>
                        <p className="text-xs text-gray-400">{relatedCoin.symbol.toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-white">
                          {getCurrencySymbol()}{relatedCoin.current_price?.toLocaleString() || 'N/A'}
                        </div>
                        <div className={`text-xs font-medium ${relatedCoin.price_change_percentage_7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {relatedCoin.price_change_percentage_7d ? 
                            `${relatedCoin.price_change_percentage_7d >= 0 ? '+' : ''}${relatedCoin.price_change_percentage_7d.toFixed(2)}%` : 
                            'N/A'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content - Chart, News, and Price Alert */}
          <div className="lg:col-span-6">
            {/* Chart Section */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl bg-white/5 shadow-xl m-4 md:m-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold flex items-center">
                    <img 
                      src={coin.image?.large || coin.image?.small || coin.image?.thumb || coin.image} 
                      alt={coin.name} 
                      className="h-8 w-8 rounded-full mr-3"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/32/19191c/FFFFFF?text=' + coin.symbol?.toUpperCase();
                      }}
                    />
                    {coin.name} ({coin.symbol?.toUpperCase()})
                  </h1>
                  <div className="flex items-center mt-1">
                    <span ref={priceFlashRef} className="text-2xl font-bold">
                      {getCurrencySymbol()}{livePrice?.toLocaleString() || currentPrice.toLocaleString()}
                    </span>
                    <span className={`ml-3 px-2 py-1 rounded-full text-sm font-bold ${priceChange24h >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {priceChange24h >= 0 ? <TrendingUp className="inline mr-1" size={16} /> : <TrendingDown className="inline mr-1" size={16} />}
                      {formatPercentage(priceChange24h)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  <div className="flex flex-wrap gap-2">
                    {['1H', '24H', '7D', '30D', '1Y', 'ALL'].map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          timeRange === range 
                            ? 'bg-orange-500 text-white' 
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="h-96 min-h-96">
                {isChartLoading ? (
                  <div className="w-full h-full bg-white/5 rounded-xl animate-pulse flex items-center justify-center">
                    <div className="text-gray-400">Loading chart data...</div>
                  </div>
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} ref={chartRef}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(timestamp) => formatTime(timestamp)}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        axisLine={{ stroke: '#334155' }}
                        tickLine={{ stroke: '#334155' }}
                      />
                      <YAxis 
                        domain={['auto', 'auto']} 
                        tickFormatter={(value) => `${getCurrencySymbol()}${value.toLocaleString()}`}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        axisLine={{ stroke: '#334155' }}
                        tickLine={{ stroke: '#334155' }}
                      />
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          borderColor: '#334155',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        formatter={(value) => [`${getCurrencySymbol()}${value.toLocaleString()}`, 'Price']}
                        labelFormatter={(timestamp) => formatDate(timestamp)}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#f97316" 
                        fill="url(#colorPrice)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-white/5 rounded-xl flex items-center justify-center">
                    <div className="text-gray-400">No chart data available</div>
                  </div>
                )}
              </div>
              
              
            </div>
            
            {/* Set Price Alert - Moved here from left panel */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl bg-white/5 shadow-xl m-4 md:m-6">
              <h2 className="text-xl font-bold mb-4">Set Price Alert</h2>
              
              <div className="space-y-4">
                <div className="text-sm text-gray-300">
                  Current Price: <span className="font-bold text-white">${livePrice?.toLocaleString() || currentPrice.toLocaleString()}</span>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Alert me when price reaches:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      {getCurrencySymbol()}
                    </span>
                    <input
                      type="number"
                      value={alertPrice}
                      onChange={(e) => setAlertPrice(e.target.value)}
                      placeholder="Set alert at $ ______"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleSetAlert}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform"
                >
                  Set Alert
                </button>
              </div>
            </div>
            
            {/* News Section */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl bg-white/5 shadow-xl m-4 md:m-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-xl font-bold">Latest News</h2>
                <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                  <button className="px-3 py-1 bg-orange-500 text-white rounded-lg text-sm">All</button>
                  <button className="px-3 py-1 bg-white/5 text-gray-300 hover:bg-white/10 rounded-lg text-sm">Latest</button>
                  <button className="px-3 py-1 bg-white/5 text-gray-300 hover:bg-white/10 rounded-lg text-sm">Trending</button>
                </div>
              </div>
              
              <div className="space-y-4">
                {news.map((article) => (
                  <a
                    key={article.id}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card p-4 rounded-xl border border-white/10 hover:border-orange-500/50 transition-all cursor-pointer block"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <img 
                        src={article.thumbnail} 
                        alt={article.title} 
                        className="w-full md:w-32 h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <div className="flex justify-between items-center text-sm text-gray-400">
                          <span>{article.source?.name || 'Unknown Source'}</span>
                          <span>{formatTime(new Date(article.created_at))}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Panel - Live Stats and Price Performance */}
          <div className="lg:col-span-3">
            <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl bg-white/5 shadow-xl m-4 md:m-6">
              <h2 className="text-xl font-bold mb-6">Live Stats</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-gray-400 text-sm">24H Change</div>
                    <div className={`font-bold ${priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatPercentage(priceChange24h)}
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-gray-400 text-sm">7D Change</div>
                    <div className={`font-bold ${priceChange7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatPercentage(priceChange7d)}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-gray-400 text-sm">30D Change</div>
                    <div className={`font-bold ${priceChange30d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatPercentage(priceChange30d)}
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-gray-400 text-sm">Market Cap</div>
                    <div className="font-bold">
                      {getCurrencySymbol()}{formatNumber(marketCap)}
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-gray-400 text-sm">Volume (24h)</div>
                  <div className="font-bold">
                    {getCurrencySymbol()}{formatNumber(volume24h)}
                  </div>
                </div>
                
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-gray-400 text-sm">Fully Diluted Valuation</div>
                  <div className="font-bold">
                    {getCurrencySymbol()}{formatNumber(fdv)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-gray-400 text-sm">Circulating Supply</div>
                    <div className="font-bold">
                      {formatNumber(circulatingSupply)} {coin.symbol?.toUpperCase()}
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-gray-400 text-sm">Max Supply</div>
                    <div className="font-bold">
                      {maxSupply ? `${formatNumber(maxSupply)} ${coin.symbol?.toUpperCase()}` : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Price Performance */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl bg-white/5 shadow-xl mt-6 m-4 md:m-6">
              <h2 className="text-xl font-bold mb-6">Price Performance</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">52W Low</span>
                  <div className="font-bold text-green-500">
                    {getCurrencySymbol()}{atl.toLocaleString()}
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">52W High</span>
                  <div className="font-bold text-red-500">
                    {getCurrencySymbol()}{ath.toLocaleString()}
                  </div>
                </div>
                
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-gray-400 text-sm">All-Time High</div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-bold">
                      {getCurrencySymbol()}{ath.toLocaleString()}
                    </span>
                    <span className="text-red-500 text-sm">
                      {formatPercentage(athChange)} down
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    {athDate ? formatDate(new Date(athDate)) : 'N/A'}
                  </div>
                </div>
                
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-gray-400 text-sm">All-Time Low</div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-bold">
                      {getCurrencySymbol()}{atl.toLocaleString()}
                    </span>
                    <span className="text-green-500 text-sm">
                      {formatPercentage(atlChange)} up
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    {atlDate ? formatDate(new Date(atlDate)) : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
