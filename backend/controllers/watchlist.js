import User from '../models/User.js';

// @desc    Get user watchlist
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = async (req, res, next) => {
  try {
    console.log('Fetching watchlist for user:', req.user._id);
    const user = await User.findById(req.user._id);
    if (user) {
      console.log('Watchlist found:', user.watchlist.length, 'items');
      res.json(user.watchlist);
    } else {
      console.log('User not found for watchlist fetch');
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add coin to watchlist
// @route   POST /api/watchlist/add
// @access  Private
const addToWatchlist = async (req, res, next) => {
  try {
    const { coinId, name, symbol, image } = req.body;
    
    console.log('Adding coin to watchlist:', { coinId, name, symbol, image });

    // Validate required fields
    if (!coinId || !name || !symbol) {
      console.log('Invalid coin data received:', { coinId, name, symbol, image });
      return res.status(400).json({ 
        message: 'Invalid coin data. Required fields: coinId, name, symbol' 
      });
    }

    console.log('Finding user by ID:', req.user._id);
    const user = await User.findById(req.user._id);
    if (user) {
      console.log('User found:', user._id);
      // Check if coin already in watchlist
      const coinExists = user.watchlist.find(
        (coin) => coin.coinId === coinId
      );
      
      console.log('Coin exists check:', coinExists);

      if (coinExists) {
        console.log('Coin already in watchlist');
        return res.status(400).json({ message: 'Coin already in watchlist' });
      }

      // Add coin to watchlist
      console.log('Adding coin to watchlist array');
      user.watchlist.push({
        coinId,
        name,
        symbol,
        image: image || '' // Allow empty image but don't require it
      });

      console.log('Saving user with updated watchlist');
      const updatedUser = await user.save();
      console.log('User saved successfully, watchlist length:', updatedUser.watchlist.length);
      res.json(updatedUser.watchlist);
    } else {
      console.log('User not found for watchlist add');
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    // Log more details about the error
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', error.errors);
      return res.status(400).json({ message: 'Invalid data format', error: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Remove coin from watchlist
// @route   DELETE /api/watchlist/remove/:coinId
// @access  Private
const removeFromWatchlist = async (req, res, next) => {
  try {
    console.log('Removing coin from watchlist:', req.params.coinId);
    console.log('User ID:', req.user._id);
    const user = await User.findById(req.user._id);
    if (user) {
      console.log('User found, current watchlist length:', user.watchlist.length);
      // Remove coin from watchlist
      user.watchlist = user.watchlist.filter(
        (coin) => coin.coinId !== req.params.coinId
      );
      
      console.log('After filter, watchlist length:', user.watchlist.length);

      const updatedUser = await user.save();
      console.log('User saved successfully after removal');
      res.json(updatedUser.watchlist);
    } else {
      console.log('User not found for watchlist remove');
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { getWatchlist, addToWatchlist, removeFromWatchlist };