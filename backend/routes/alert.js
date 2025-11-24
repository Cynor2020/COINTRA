import express from 'express';
const router = express.Router();
import {
  getAlerts,
  createAlert,
  deleteAlert
} from '../controllers/alert.js';
import { protect } from '../middleware/auth.js';

router.get('/', protect, getAlerts);
router.post('/create', protect, createAlert);
router.delete('/delete/:id', protect, deleteAlert);

export default router;