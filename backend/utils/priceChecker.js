import axios from 'axios';
import User from '../models/User.js';

// Function to check alerts and update status if triggered
const checkAlerts = async () => {
  try {
    console.log('Checking alerts...');
    
    // Get all users with pending alerts
    const users = await User.find({ 'alerts.status': 'pending' });
    
    if (users.length === 0) {
      console.log('No pending alerts found');
      return;
    }
    
    // Get all unique coin IDs from pending alerts
    const coinIds = [];
    users.forEach(user => {
      user.alerts.forEach(alert => {
        if (alert.status === 'pending' && !coinIds.includes(alert.coinId)) {
          coinIds.push(alert.coinId);
        }
      });
    });
    
    if (coinIds.length === 0) {
      console.log('No coin IDs found in pending alerts');
      return;
    }
    
    // Fetch current prices for all coins
    const vsCurrency = 'usd'; // Default to USD
    const coinIdsString = coinIds.join(',');
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinIdsString}&vs_currencies=${vsCurrency}`
    );
    
    const prices = response.data;
    
    // Check each user's alerts
    for (const user of users) {
      let userUpdated = false;
      
      for (const alert of user.alerts) {
        if (alert.status === 'pending') {
          const currentPrice = prices[alert.coinId]?.[vsCurrency];
          
          if (currentPrice !== undefined) {
            // Check if target price is reached
            if (
              (alert.targetPrice > 0 && currentPrice >= alert.targetPrice) ||
              (alert.targetPrice < 0 && currentPrice <= Math.abs(alert.targetPrice))
            ) {
              // Update alert status to triggered
              alert.status = 'triggered';
              userUpdated = true;
              
              console.log(`Alert triggered for user ${user.email}: ${alert.coinName} reached ${currentPrice}`);
              
              // Here you could implement additional notification logic
              // For example, sending a WebSocket message to the frontend
            }
          }
        }
      }
      
      // Save user if any alerts were updated
      if (userUpdated) {
        await user.save();
      }
    }
    
    console.log('Alert checking completed');
  } catch (error) {
    console.error('Error checking alerts:', error.message);
  }
};

export default checkAlerts;