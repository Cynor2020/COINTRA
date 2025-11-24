import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCoinMarkets } from '../services/coingecko';
import Header from '../components/Header';
import Hero from '../components/Hero';
import CryptoTable from '../components/CryptoTable';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const Home = () => {
  const { data: coins = [], isLoading, error, refetch } = useQuery({
    queryKey: ['coins'],
    queryFn: () => getCoinMarkets('inr', 100),
    refetchInterval: 60000,
    staleTime: 30000,
    retry: 2,
  });

  useEffect(() => {
    if (error) {
      console.error('Coin data fetch error:', error);
      toast.error('Failed to fetch coin data: ' + error.message);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Header />
      <Hero />
      <CryptoTable 
        coins={coins}
        isLoading={isLoading}
        error={error}
      />
      <Features />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;