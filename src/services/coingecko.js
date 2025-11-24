import axios from 'axios';

// Using the free CoinGecko API instead of Pro API to avoid authentication issues
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

const api = axios.create({
  baseURL: COINGECKO_API,
  timeout: 10000, // 10 second timeout
});

// Add request interceptor to log requests
api.interceptors.request.use(
  (config) => {
    console.log('CoinGecko API Request:', config);
    return config;
  },
  (error) => {
    console.error('CoinGecko API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to log responses
api.interceptors.response.use(
  (response) => {
    console.log('CoinGecko API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('CoinGecko API Response Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Mock data for fallback with all required fields
const mockCoins = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 45000,
    price_change_percentage_1h: 0.5,
    price_change_percentage_24h: 2.5,
    price_change_percentage_7d: 5.2,
    market_cap: 800000000000,
    total_volume: 25000000000,
    circulating_supply: 19000000,
    sparkline_in_7d: { 
      price: [44000, 44200, 44500, 44800, 44900, 45100, 45000] 
    }
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3200,
    price_change_percentage_1h: -0.2,
    price_change_percentage_24h: -1.2,
    price_change_percentage_7d: 3.8,
    market_cap: 380000000000,
    total_volume: 15000000000,
    circulating_supply: 120000000,
    sparkline_in_7d: { 
      price: [3250, 3240, 3230, 3220, 3210, 3205, 3200] 
    }
  },
  {
    id: "tether",
    symbol: "usdt",
    name: "Tether",
    image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    current_price: 1.0,
    price_change_percentage_1h: 0.0,
    price_change_percentage_24h: 0.01,
    price_change_percentage_7d: 0.05,
    market_cap: 120000000000,
    total_volume: 50000000000,
    circulating_supply: 120000000000,
    sparkline_in_7d: { 
      price: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0] 
    }
  },
  {
    id: "binancecoin",
    symbol: "bnb",
    name: "BNB",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    current_price: 420,
    price_change_percentage_1h: 1.1,
    price_change_percentage_24h: 3.1,
    price_change_percentage_7d: 8.5,
    market_cap: 65000000000,
    total_volume: 2000000000,
    circulating_supply: 150000000,
    sparkline_in_7d: { 
      price: [410, 415, 418, 419, 420, 422, 420] 
    }
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 120,
    price_change_percentage_1h: -0.8,
    price_change_percentage_24h: -2.3,
    price_change_percentage_7d: -5.1,
    market_cap: 55000000000,
    total_volume: 3000000000,
    circulating_supply: 450000000,
    sparkline_in_7d: { 
      price: [125, 124, 123, 122, 121, 120.5, 120] 
    }
  },
  {
    id: "ripple",
    symbol: "xrp",
    name: "XRP",
    image: "https://assets.coingecko.com/coins/images/44/large/xrp.png",
    current_price: 0.65,
    price_change_percentage_1h: 0.3,
    price_change_percentage_24h: 1.8,
    price_change_percentage_7d: 4.2,
    market_cap: 35000000000,
    total_volume: 1500000000,
    circulating_supply: 50000000000,
    sparkline_in_7d: { 
      price: [0.62, 0.63, 0.64, 0.645, 0.65, 0.652, 0.65] 
    }
  },
  {
    id: "usd-coin",
    symbol: "usdc",
    name: "USD Coin",
    image: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
    current_price: 1.0,
    price_change_percentage_1h: 0.0,
    price_change_percentage_24h: 0.0,
    price_change_percentage_7d: 0.0,
    market_cap: 32000000000,
    total_volume: 4000000000,
    circulating_supply: 32000000000,
    sparkline_in_7d: { 
      price: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0] 
    }
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 0.55,
    price_change_percentage_1h: -0.1,
    price_change_percentage_24h: -1.5,
    price_change_percentage_7d: 2.3,
    market_cap: 19000000000,
    total_volume: 800000000,
    circulating_supply: 35000000000,
    sparkline_in_7d: { 
      price: [0.57, 0.56, 0.555, 0.55, 0.545, 0.548, 0.55] 
    }
  },
  {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    current_price: 0.12,
    price_change_percentage_1h: 0.8,
    price_change_percentage_24h: 3.2,
    price_change_percentage_7d: 7.8,
    market_cap: 17000000000,
    total_volume: 1200000000,
    circulating_supply: 140000000000,
    sparkline_in_7d: { 
      price: [0.11, 0.112, 0.115, 0.118, 0.119, 0.121, 0.12] 
    }
  },
  {
    id: "polygon",
    symbol: "matic",
    name: "Polygon",
    image: "https://assets.coingecko.com/coins/images/4713/large/matic.png",
    current_price: 0.85,
    price_change_percentage_1h: -0.3,
    price_change_percentage_24h: -2.1,
    price_change_percentage_7d: 1.5,
    market_cap: 8500000000,
    total_volume: 600000000,
    circulating_supply: 10000000000,
    sparkline_in_7d: { 
      price: [0.88, 0.87, 0.86, 0.855, 0.85, 0.852, 0.85] 
    }
  },
  {
    id: "litecoin",
    symbol: "ltc",
    name: "Litecoin",
    image: "https://assets.coingecko.com/coins/images/2/large/litecoin.png",
    current_price: 85,
    price_change_percentage_1h: 0.4,
    price_change_percentage_24h: 1.9,
    price_change_percentage_7d: 4.7,
    market_cap: 6200000000,
    total_volume: 400000000,
    circulating_supply: 73000000,
    sparkline_in_7d: { 
      price: [82, 83, 84, 84.5, 84.8, 85.1, 85] 
    }
  },
  {
    id: "polkadot",
    symbol: "dot",
    name: "Polkadot",
    image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    current_price: 7.2,
    price_change_percentage_1h: -0.2,
    price_change_percentage_24h: -1.8,
    price_change_percentage_7d: 3.2,
    market_cap: 9000000000,
    total_volume: 300000000,
    circulating_supply: 1250000000,
    sparkline_in_7d: { 
      price: [7.5, 7.4, 7.3, 7.25, 7.22, 7.21, 7.2] 
    }
  },
  {
    id: "chainlink",
    symbol: "link",
    name: "Chainlink",
    image: "https://assets.coingecko.com/coins/images/877/large/chainlink.png",
    current_price: 18.5,
    price_change_percentage_1h: 0.6,
    price_change_percentage_24h: 2.4,
    price_change_percentage_7d: 6.1,
    market_cap: 11000000000,
    total_volume: 500000000,
    circulating_supply: 590000000,
    sparkline_in_7d: { 
      price: [17.8, 18.0, 18.2, 18.3, 18.4, 18.45, 18.5] 
    }
  },
  {
    id: "bitcoin-cash",
    symbol: "bch",
    name: "Bitcoin Cash",
    image: "https://assets.coingecko.com/coins/images/780/large/bitcoin-cash.png",
    current_price: 350,
    price_change_percentage_1h: -0.1,
    price_change_percentage_24h: 0.8,
    price_change_percentage_7d: 2.9,
    market_cap: 6800000000,
    total_volume: 250000000,
    circulating_supply: 19500000,
    sparkline_in_7d: { 
      price: [345, 347, 348, 349, 349.5, 349.8, 350] 
    }
  },
  {
    id: "stellar",
    symbol: "xlm",
    name: "Stellar",
    image: "https://assets.coingecko.com/coins/images/100/large/stellar.png",
    current_price: 0.14,
    price_change_percentage_1h: 0.2,
    price_change_percentage_24h: 1.5,
    price_change_percentage_7d: 3.8,
    market_cap: 3200000000,
    total_volume: 150000000,
    circulating_supply: 23000000000,
    sparkline_in_7d: { 
      price: [0.135, 0.136, 0.137, 0.138, 0.139, 0.1395, 0.14] 
    }
  },
  {
    id: "uniswap",
    symbol: "uni",
    name: "Uniswap",
    image: "https://assets.coingecko.com/coins/images/12504/large/uniswap.png",
    current_price: 12.8,
    price_change_percentage_1h: -0.4,
    price_change_percentage_24h: -2.2,
    price_change_percentage_7d: 1.8,
    market_cap: 9600000000,
    total_volume: 400000000,
    circulating_supply: 750000000,
    sparkline_in_7d: { 
      price: [13.2, 13.1, 13.0, 12.9, 12.85, 12.82, 12.8] 
    }
  },
  {
    id: "wrapped-bitcoin",
    symbol: "wbtc",
    name: "Wrapped Bitcoin",
    image: "https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png",
    current_price: 45000,
    price_change_percentage_1h: 0.5,
    price_change_percentage_24h: 2.5,
    price_change_percentage_7d: 5.2,
    market_cap: 7200000000,
    total_volume: 100000000,
    circulating_supply: 160000,
    sparkline_in_7d: { 
      price: [44000, 44200, 44500, 44800, 44900, 45100, 45000] 
    }
  },
  {
    id: "ethereum-classic",
    symbol: "etc",
    name: "Ethereum Classic",
    image: "https://assets.coingecko.com/coins/images/453/large/ethereum-classic.png",
    current_price: 28.5,
    price_change_percentage_1h: 0.3,
    price_change_percentage_24h: 1.7,
    price_change_percentage_7d: 4.5,
    market_cap: 4100000000,
    total_volume: 200000000,
    circulating_supply: 145000000,
    sparkline_in_7d: { 
      price: [27.8, 28.0, 28.2, 28.3, 28.4, 28.45, 28.5] 
    }
  },
  {
    id: "filecoin",
    symbol: "fil",
    name: "Filecoin",
    image: "https://assets.coingecko.com/coins/images/12817/large/filecoin.png",
    current_price: 6.2,
    price_change_percentage_1h: -0.5,
    price_change_percentage_24h: -1.9,
    price_change_percentage_7d: 2.1,
    market_cap: 3100000000,
    total_volume: 150000000,
    circulating_supply: 500000000,
    sparkline_in_7d: { 
      price: [6.5, 6.4, 6.3, 6.25, 6.22, 6.21, 6.2] 
    }
  },
  {
    id: "tron",
    symbol: "trx",
    name: "TRON",
    image: "https://assets.coingecko.com/coins/images/1094/large/tron.png",
    current_price: 0.16,
    price_change_percentage_1h: 0.1,
    price_change_percentage_24h: 0.9,
    price_change_percentage_7d: 3.2,
    market_cap: 14000000000,
    total_volume: 600000000,
    circulating_supply: 87000000000,
    sparkline_in_7d: { 
      price: [0.155, 0.156, 0.157, 0.158, 0.159, 0.1595, 0.16] 
    }
  }
];

// Get the currency (always USD now)
const getCurrency = () => {
  return 'usd';
};

export const getCoinMarkets = async (vsCurrency = 'usd', perPage = 100) => {
  try {
    console.log(`Fetching coin markets: vs_currency=${vsCurrency}, per_page=${perPage}`);
    
    // For the free CoinGecko API, we can only fetch 250 coins per page
    // To get more coins, we need to make multiple requests
    const maxPerPage = 250;
    const totalPages = Math.min(Math.ceil(perPage / maxPerPage), 4); // Limit to 4 pages (1000 coins max)
    const coinsPerRequest = Math.min(perPage, maxPerPage);
    
    // Fetch multiple pages if needed
    const allCoins = [];
    for (let page = 1; page <= totalPages; page++) {
      console.log(`Fetching page ${page} of coin markets`);
      const response = await api.get('/coins/markets', {
        params: {
          vs_currency: vsCurrency.toLowerCase(),
          order: 'market_cap_desc',
          per_page: coinsPerRequest,
          page: page,
          sparkline: true,
          price_change_percentage: '1h,24h,7d',
        },
      });
      console.log(`Page ${page} fetched successfully:`, response.data.length, 'coins');
      allCoins.push(...response.data);
      
      // If we've reached the requested number of coins, stop fetching
      if (allCoins.length >= perPage) {
        break;
      }
    }
    
    // Trim to the exact number requested
    const result = allCoins.slice(0, perPage);
    console.log('Total coins fetched:', result.length);
    return result;
  } catch (error) {
    console.error('Error fetching coin markets:', error.response?.data || error.message);
    
    // If it's a network error, return mock data
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      console.log('Network error detected, returning mock data');
      // Convert mock prices to the selected currency
      let conversionRate = 1;
      // No conversion needed as we're using USD only
      conversionRate = 1;
      
      return mockCoins.map(coin => ({
        ...coin,
        current_price: coin.current_price * conversionRate,
        price_change_percentage_1h: coin.price_change_percentage_1h,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        price_change_percentage_7d: coin.price_change_percentage_7d
      }));
    }
    
    throw new Error(`Failed to fetch coin data: ${error.response?.statusText || error.response?.status || error.message}`);
  }
};

export const getCoinMarketChart = async (coinId, days = 7, vsCurrency = 'usd') => {
  try {
    console.log(`Fetching market chart for ${coinId}: days=${days}, vs_currency=${vsCurrency}`);
    const response = await api.get(`/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: vsCurrency.toLowerCase(),
        days: days,
      },
    });
    console.log('Market chart fetched successfully for', coinId);
    return response.data;
  } catch (error) {
    console.error('Error fetching market chart:', error.response?.data || error.message);
    
    // If it's a network error, return mock chart data
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      console.log('Network error detected, returning mock chart data');
      // Generate mock chart data
      const prices = [];
      const now = Date.now();
      for (let i = days; i >= 0; i--) {
        const timestamp = now - i * 24 * 60 * 60 * 1000;
        // Generate some mock price data
        const basePrice = coinId === 'bitcoin' ? 45000 : coinId === 'ethereum' ? 3200 : 100;
        const variation = (Math.random() - 0.5) * basePrice * 0.1;
        prices.push([timestamp, basePrice + variation]);
      }
      return { prices };
    }
    
    throw new Error(`Failed to fetch chart data: ${error.response?.statusText || error.response?.status || error.message}`);
  }
};

// Add function to get coin data by ID
export const getCoinById = async (coinId, vsCurrency = 'usd') => {
  try {
    console.log(`Fetching coin data for ${coinId}`);
    const response = await api.get(`/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: true
      },
    });
    console.log('Coin data fetched successfully for', coinId);
    return response.data;
  } catch (error) {
    console.error('Error fetching coin data:', error.response?.data || error.message);
    
    // If it's a network error, return mock coin data
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      console.log('Network error detected, returning mock coin data');
      // Find mock coin data
      const mockCoin = mockCoins.find(coin => coin.id === coinId);
      if (mockCoin) {
        return {
          ...mockCoin,
          market_data: {
            current_price: {
              'usd': mockCoin.current_price
            },
            market_cap: {
              'usd': mockCoin.market_cap
            },
            total_volume: {
              'usd': mockCoin.total_volume
            },
            price_change_percentage_1h: mockCoin.price_change_percentage_1h,
            price_change_percentage_24h: mockCoin.price_change_percentage_24h,
            price_change_percentage_7d: mockCoin.price_change_percentage_7d,
            price_change_percentage_30d: mockCoin.price_change_percentage_7d * 4,
            price_change_percentage_1y: mockCoin.price_change_percentage_7d * 52,
            ath: {
              'usd': mockCoin.current_price * 1.5
            },
            ath_change_percentage: {
              'usd': -30
            },
            atl: {
              'usd': mockCoin.current_price * 0.5
            },
            atl_change_percentage: {
              'usd': 100
            },
            market_cap_rank: 1,
            circulating_supply: mockCoin.circulating_supply,
            total_supply: mockCoin.circulating_supply * 1.2,
            max_supply: mockCoin.circulating_supply * 1.5,
            fully_diluted_valuation: {
              'usd': mockCoin.market_cap * 1.5
            }
          },
          symbol: mockCoin.symbol,
          name: mockCoin.name,
          image: {
            large: mockCoin.image
          }
        };
      }
    }
    
    throw new Error(`Failed to fetch coin data: ${error.response?.statusText || error.response?.status || error.message}`);
  }
};

// Add function to get coin market chart range
export const getCoinMarketChartRange = async (coinId, from, to, vsCurrency = 'usd') => {
  try {
    console.log(`Fetching market chart range for ${coinId}: from=${from}, to=${to}, vs_currency=${vsCurrency}`);
    const response = await api.get(`/coins/${coinId}/market_chart/range`, {
      params: {
        vs_currency: vsCurrency.toLowerCase(),
        from: from,
        to: to,
      },
    });
    console.log('Market chart range fetched successfully for', coinId);
    return response.data;
  } catch (error) {
    console.error('Error fetching market chart range:', error.response?.data || error.message);
    
    // If it's a network error, return mock chart data
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      console.log('Network error detected, returning mock chart range data');
      // Generate mock chart data
      const prices = [];
      const volumes = [];
      const market_caps = [];
      const now = Date.now();
      const days = Math.ceil((to - from) / (24 * 60 * 60));
      for (let i = days; i >= 0; i--) {
        const timestamp = now - i * 24 * 60 * 60 * 1000;
        // Generate some mock price data
        const basePrice = coinId === 'bitcoin' ? 45000 : coinId === 'ethereum' ? 3200 : 100;
        const variation = (Math.random() - 0.5) * basePrice * 0.1;
        prices.push([timestamp, basePrice + variation]);
        volumes.push([timestamp, Math.random() * 1000000000]);
        market_caps.push([timestamp, (basePrice + variation) * 1000000]);
      }
      return { prices, market_caps, total_volumes: volumes };
    }
    
    throw new Error(`Failed to fetch chart range data: ${error.response?.statusText || error.response?.status || error.message}`);
  }
};

// Get related coins (people also viewed)
export const getRelatedCoins = async (coinId, vsCurrency = getCurrency(), limit = 5) => {
  try {
    console.log(`Fetching related coins for ${coinId}`);
    
    // Fetch top coins by market cap as related coins
    const topCoinsResponse = await api.get('/coins/markets', {
      params: {
        vs_currency: vsCurrency,
        order: 'market_cap_desc',
        per_page: limit + 5, // Fetch more to filter out the current coin
        page: 1,
        sparkline: false,
        price_change_percentage: '7d'
      },
    });
    
    // Filter out the current coin and take first 5
    const relatedCoins = topCoinsResponse.data
      .filter(coin => coin.id !== coinId)
      .slice(0, limit)
      .map(coin => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
        current_price: coin.current_price,
        price_change_percentage_7d: coin.price_change_percentage_7d_in_currency || coin.price_change_percentage_7d
      }));
    
    console.log('Related coins fetched successfully', relatedCoins);
    return relatedCoins;
  } catch (error) {
    console.error('Error fetching related coins:', error);
    // Return mock data as fallback
    return [
      {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'eth',
        image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
        current_price: 3200,
        price_change_percentage_7d: 2.5
      },
      {
        id: 'binancecoin',
        name: 'BNB',
        symbol: 'bnb',
        image: 'https://assets.coingecko.com/coins/images/825/small/binance-coin.png',
        current_price: 450,
        price_change_percentage_7d: -1.2
      },
      {
        id: 'solana',
        name: 'Solana',
        symbol: 'sol',
        image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
        current_price: 150,
        price_change_percentage_7d: 5.8
      },
      {
        id: 'ripple',
        name: 'Ripple',
        symbol: 'xrp',
        image: 'https://assets.coingecko.com/coins/images/44/small/ripple.png',
        current_price: 0.75,
        price_change_percentage_7d: 0.8
      },
      {
        id: 'cardano',
        name: 'Cardano',
        symbol: 'ada',
        image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
        current_price: 0.55,
        price_change_percentage_7d: -0.5
      }
    ];
  }
};

// Get 7-day market chart data for a coin
export const getCoinMarketChart7d = async (coinId, vsCurrency = getCurrency()) => {
  try {
    console.log(`Fetching 7-day chart data for ${coinId}`);
    const response = await api.get(`/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: vsCurrency,
        days: 7,
        interval: 'daily'
      },
    });
    console.log('7-day chart data fetched successfully for', coinId);
    return response.data;
  } catch (error) {
    console.error('Error fetching 7-day chart data:', error);
    // Return mock data as fallback
    const now = Date.now();
    const mockData = {
      prices: [],
      market_caps: [],
      total_volumes: []
    };
    
    // Generate mock data for 7 days
    for (let i = 6; i >= 0; i--) {
      const timestamp = now - (i * 24 * 60 * 60 * 1000);
      const basePrice = Math.random() * 1000 + 100;
      const variation = (Math.random() - 0.5) * basePrice * 0.1;
      const price = basePrice + variation;
      
      mockData.prices.push([timestamp, price]);
      mockData.market_caps.push([timestamp, price * 1000000]);
      mockData.total_volumes.push([timestamp, price * 10000]);
    }
    
    return mockData;
  }
};
