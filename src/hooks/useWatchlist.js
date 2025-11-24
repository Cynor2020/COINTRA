import { useState, useEffect } from 'react';
import axios from 'axios';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch watchlist from backend
  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/watchlist');
      setWatchlist(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching watchlist:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch watchlist';
      setError(errorMessage);
      setWatchlist([]);
    } finally {
      setLoading(false);
    }
  };

  // Add coin to watchlist
  const addToWatchlist = async (coin) => {
    try {
      console.log('Adding coin to watchlist:', coin);
      // Validate coin object
      if (!coin.id || !coin.name || !coin.symbol) {
        console.error('Invalid coin object:', coin);
        return { success: false, error: 'Invalid coin data. Required fields: id, name, symbol' };
      }
      
      // Extract image URL properly
      let imageUrl = '';
      if (typeof coin.image === 'string') {
        imageUrl = coin.image;
      } else if (coin.image && typeof coin.image === 'object') {
        // Handle different image formats from CoinGecko API
        if (coin.image.large) {
          imageUrl = coin.image.large;
        } else if (coin.image.small) {
          imageUrl = coin.image.small;
        } else if (coin.image.thumb) {
          imageUrl = coin.image.thumb;
        } else {
          // Fallback to a default image
          imageUrl = `https://via.placeholder.com/32/19191c/FFFFFF?text=${coin.symbol.toUpperCase()}`;
        }
      } else {
        // Fallback to a default image
        imageUrl = `https://via.placeholder.com/32/19191c/FFFFFF?text=${coin.symbol.toUpperCase()}`;
      }
      
      const requestData = {
        coinId: coin.id,  // Changed from coin.id to match backend expectation
        name: coin.name,
        symbol: coin.symbol,
        image: imageUrl
      };
      
      console.log('Sending request data:', requestData);
      
      const response = await axios.post('/api/watchlist/add', requestData);
      setWatchlist(response.data);
      return { success: true };
    } catch (err) {
      console.error('Error adding to watchlist:', err);
      console.error('Error response:', err.response);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add to watchlist';
      // Add more detailed error information
      const detailedError = err.response?.data?.error ? `${errorMessage}: ${err.response.data.error}` : errorMessage;
      return { success: false, error: detailedError };
    }
  };

  // Remove coin from watchlist
  const removeFromWatchlist = async (coinId) => {
    try {
      console.log('Removing coin from watchlist:', coinId);
      const response = await axios.delete(`/api/watchlist/remove/${coinId}`);
      setWatchlist(response.data);
      return { success: true };
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      console.error('Error response:', err.response);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to remove from watchlist';
      // Add more detailed error information
      const detailedError = err.response?.data?.error ? `${errorMessage}: ${err.response.data.error}` : errorMessage;
      return { success: false, error: detailedError };
    }
  };

  // Fetch watchlist on component mount
  useEffect(() => {
    fetchWatchlist();
  }, []);

  return {
    watchlist,
    loading,
    error,
    fetchWatchlist,
    addToWatchlist,
    removeFromWatchlist
  };
};