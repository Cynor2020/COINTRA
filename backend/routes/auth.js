import express from 'express';
const router = express.Router();
import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  updateCurrency
} from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/logout', logoutUser);
router.patch('/currency', protect, updateCurrency);

export default router;