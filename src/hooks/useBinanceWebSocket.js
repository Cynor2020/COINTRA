import { useState, useEffect } from 'react';

export const useBinanceWebSocket = (coinIds = []) => {
  const [prices, setPrices] = useState({});

  useEffect(() => {
    if (coinIds.length === 0) return;

    // Create streams for the top coins
    const streams = coinIds.slice(0, 10).map(id => {
      // Map CoinGecko IDs to Binance symbols
      const symbolMap = {
        'bitcoin': 'btcusdt',
        'ethereum': 'ethusdt',
        'binancecoin': 'bnbusdt',
        'solana': 'solusdt',
        'ripple': 'xrpusdt',
        'cardano': 'adausdt',
        'dogecoin': 'dogeusdt',
        'polygon': 'maticusdt',
        'polkadot': 'dotusdt',
        'litecoin': 'ltcusdt'
      };
      
      const symbol = symbolMap[id] || `${id}usdt`;
      return `${symbol}@ticker`;
    }).join('/');

    let ws;
    let reconnectTimeout;
    
    const connect = () => {
      try {
        const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('Binance WebSocket connected');
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            const { data } = message;
            
            // Extract symbol and convert to lowercase
            const symbol = data.s.toLowerCase().replace('usdt', '');
            
            // Convert price to number and calculate 24h change
            const price = parseFloat(data.c);
            const change24h = parseFloat(data.P);
            
            // Validate data before updating state
            if (isNaN(price) || isNaN(change24h)) {
              console.warn('Invalid price data received from Binance:', data);
              return;
            }
            
            setPrices(prev => ({
              ...prev,
              [symbol]: { price, change24h }
            }));
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('Binance WebSocket error:', error);
          // Don't crash the app, just continue with API data
        };

        ws.onclose = (event) => {
          console.log('Binance WebSocket closed:', event.reason);
          // Clear any existing reconnect timeout
          if (reconnectTimeout) {
            clearTimeout(reconnectTimeout);
          }
          // Try to reconnect after 5 seconds
          reconnectTimeout = setTimeout(() => {
            console.log('Attempting to reconnect to Binance WebSocket...');
            connect();
          }, 5000);
        };
      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        // Try to reconnect after 5 seconds
        reconnectTimeout = setTimeout(() => {
          console.log('Attempting to reconnect to Binance WebSocket...');
          connect();
        }, 5000);
      }
    };

    // Initial connection
    connect();

    return () => {
      // Clean up on unmount
      if (ws) {
        ws.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [coinIds]);

  return prices;
};