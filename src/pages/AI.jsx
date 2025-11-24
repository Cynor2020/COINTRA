import React, { useState, useEffect } from 'react';
import { Sparkles, LogOut, Home, Star, Bell, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function AI() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');

  // Mock data for different coins
  const coinData = {
    bitcoin: {
      name: 'Bitcoin',
      symbol: 'BTC',
      currentPrice: 43250.75,
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
    },
    ethereum: {
      name: 'Ethereum',
      symbol: 'ETH',
      currentPrice: 2650.30,
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
    },
    solana: {
      name: 'Solana',
      symbol: 'SOL',
      currentPrice: 98.45,
      image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png'
    }
  };

  // Generate mock predictions
  const generateMockPredictions = (coinId, days = 7) => {
    const coin = coinData[coinId] || coinData.bitcoin;
    const predictions = [];
    let currentPrice = coin.currentPrice;
    
    for (let i = 1; i <= days; i++) {
      // Random fluctuation between -5% and +5%
      const changePercent = (Math.random() - 0.5) * 0.1;
      currentPrice = currentPrice * (1 + changePercent);
      predictions.push({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: currentPrice,
        changePercent: changePercent * 100
      });
    }
    
    return {
      coinId,
      coin,
      currentPrice: coin.currentPrice,
      predictions,
      confidence: 0.75 + Math.random() * 0.2  // 75-95% confidence
    };
  };

  useEffect(() => {
    // Simulate API call to get AI predictions
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would call our backend API
        // const response = await fetch(`/api/ai/prediction/${selectedCoin}`);
        // const data = await response.json();
        
        // For now, use mock data
        setTimeout(() => {
          const mockData = generateMockPredictions(selectedCoin);
          setPredictions(mockData);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to fetch AI predictions');
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [selectedCoin]);

  const handleLogout = () => {
    logout();
    // Don't navigate here, let ProtectedRoute handle it
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 4 : 2,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-[#05071a]">
      {/* Background Glows */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0f172a]/90 via-[#0a0e17] to-[#0f172a]/90 pointer-events-none" />
      <div className="fixed top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
      
      {/* Content Container - This will scroll */}
      <div className="relative z-10">
        {/* Use shared Header component */}
        <Header />
    
        <div className="relative z-10 max-w-none mx-0 px-0">
          {/* COINTRA AI Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6 px-4 md:px-6">
              <h2 className="text-2xl font-bold text-white">COINTRA AI</h2>
              <div className="text-sm text-gray-400">
                Real-time Predictions
              </div>
            </div>
            
            {/* Coin Selector */}
            <div className="glass-card rounded-xl p-6 border border-white/10 mx-4 md:mx-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Select Cryptocurrency</h3>
              <div className="flex flex-wrap gap-3">
                {Object.entries(coinData).map(([id, coin]) => (
                  <button
                    key={id}
                    onClick={() => setSelectedCoin(id)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                      selectedCoin === id
                        ? 'bg-orange-500 text-white'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2 rounded-full" />
                    <span>{coin.symbol}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* AI Predictions */}
            {loading ? (
              <div className="glass-card rounded-xl p-8 text-center border border-white/10 mx-4 md:mx-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Analyzing market data with AI...</p>
              </div>
            ) : error ? (
              <div className="glass-card rounded-xl p-8 text-center border border-white/10 mx-4 md:mx-6">
                <div className="text-red-500 mb-4">
                  <Sparkles className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Error</h3>
                <p className="text-gray-400 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="glass-card rounded-xl p-6 border border-white/10 mx-4 md:mx-6">
                {/* Current Price and Confidence */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div className="flex items-center mb-4 md:mb-0">
                    <img 
                      src={predictions.coin?.image} 
                      alt={predictions.coin?.name} 
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {predictions.coin?.name} ({predictions.coin?.symbol})
                      </h3>
                      <p className="text-2xl font-bold text-white">
                        {formatPrice(predictions.currentPrice)}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-600/20 p-4 rounded-xl border border-purple-500/30">
                    <div className="text-sm text-gray-300">AI Confidence</div>
                    <div className="flex items-center mt-1">
                      <Sparkles className="text-purple-500 mr-2" size={20} />
                      <span className="text-lg font-bold text-purple-400">
                        {(predictions.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Predictions Table */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Price Predictions</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 text-gray-400 font-medium">Date</th>
                          <th className="text-right py-3 text-gray-400 font-medium">Predicted Price</th>
                          <th className="text-right py-3 text-gray-400 font-medium">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {predictions.predictions?.map((prediction, index) => (
                          <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 text-white">{prediction.date}</td>
                            <td className="py-3 text-right text-white font-medium">
                              {formatPrice(prediction.price)}
                            </td>
                            <td className="py-3 text-right">
                              <span className={`font-medium flex items-center justify-end ${
                                prediction.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {prediction.changePercent >= 0 ? (
                                  <TrendingUp className="mr-1" size={16} />
                                ) : (
                                  <TrendingDown className="mr-1" size={16} />
                                )}
                                {Math.abs(prediction.changePercent).toFixed(2)}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* AI Insights */}
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-600/20 p-4 rounded-xl border border-cyan-500/30">
                  <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
                    <Sparkles className="text-cyan-500 mr-2" size={20} />
                    AI Insights
                  </h4>
                  <p className="text-gray-300">
                    Our AI model analyzes historical price data, market trends, and technical indicators to predict future price movements. 
                    This prediction is based on machine learning algorithms trained on years of cryptocurrency market data.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}