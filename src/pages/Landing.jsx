import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCoinMarkets } from '../services/coingecko';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import CryptoTable from '../components/CryptoTable';
import FeaturesSection from '../components/FeaturesSection';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';
import CoinModal from '../components/CoinModal';
import toast from 'react-hot-toast';

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('cointra_watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  const { data: coins = [], isLoading, error, refetch } = useQuery({
    queryKey: ['coins'],
    queryFn: () => getCoinMarkets('inr', 100),
    refetchInterval: 60000,
    staleTime: 30000,
    retry: 2,
  });

  useEffect(() => {
    localStorage.setItem('cointra_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    if (error) {
      console.error('Coin data fetch error:', error);
      toast.error('Failed to fetch coin data: ' + error.message);
    }
  }, [error]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCoinSelect = (coin) => {
    setSelectedCoin(coin);
    setIsModalOpen(true);
  };

  const handleToggleWatchlist = (coin) => {
    const isInWatchlist = watchlist.find((item) => item.id === coin.id);
    
    if (isInWatchlist) {
      setWatchlist(watchlist.filter((item) => item.id !== coin.id));
      toast.success(`${coin.name} removed from watchlist!`);
    } else {
      setWatchlist([...watchlist, coin]);
      toast.success(`${coin.name} added to watchlist!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex flex-col">
      <Header onSearch={handleSearch} searchQuery={searchQuery} />
      
      <div className="flex flex-1">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        
        <main className="flex-1 p-4 md:p-8">
          <CryptoTable 
            coins={coins}
            isLoading={isLoading}
            error={error}
            onCoinSelect={handleCoinSelect}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
          />
          
          <FeaturesSection />
          <Pricing />
        </main>
      </div>
      
      <Footer />
      
      <CoinModal 
        coin={selectedCoin}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToWatchlist={handleToggleWatchlist}
        watchlist={watchlist}
      />
    </div>
  );
}