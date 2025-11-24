import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CurrencyConverter = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [isOpen, setIsOpen] = useState(false);

  const currencies = [
    { code: 'USD', name: 'US Dollar' }
  ];

  // Store selected currency in localStorage
  useEffect(() => {
    setSelectedCurrency('USD');
    localStorage.setItem('cointra_currency', 'USD');
  }, []);

  const handleCurrencyChange = (currencyCode) => {
    // Do nothing as we only support USD
  };

  const selectedCurrencyObj = currencies.find(c => c.code === selectedCurrency);

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
      >
        <span>{selectedCurrency}</span>
      </button>
    </div>
  );
};

export default CurrencyConverter;