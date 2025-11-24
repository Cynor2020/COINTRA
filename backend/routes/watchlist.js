import express from 'express';
const router = express.Router();
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
} from '../controllers/watchlist.js';
import { protect } from '../middleware/auth.js';

router.get('/', protect, getWatchlist);
router.post('/add', protect, addToWatchlist);
router.delete('/remove/:coinId', protect, removeFromWatchlist);

export default router;