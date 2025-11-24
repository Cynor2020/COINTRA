import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coinId: {
    type: String,
    required: true
  },
  coinName: {
    type: String,
    required: true
  },
  targetPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'triggered'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;