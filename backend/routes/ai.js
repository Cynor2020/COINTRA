import express from 'express';
const router = express.Router();
import {
  getAIPrediction,
  getMultipleAIPredictions,
  getMarketSentiment
} from '../controllers/ai.js';
import { protect } from '../middleware/auth.js';

// Get AI prediction for a specific coin
router.get('/prediction/:coinId', protect, getAIPrediction);

// Get AI predictions for multiple coins
router.post('/predictions', protect, getMultipleAIPredictions);

// Get overall market sentiment
router.get('/sentiment', protect, getMarketSentiment);

export default router;