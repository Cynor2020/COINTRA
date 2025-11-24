import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  currency: {
    type: String,
    enum: ['USD'],
    default: 'USD'
  },
  watchlist: [{
    _id: false, // Disable auto-generated _id for subdocuments
    coinId: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: 'Coin ID is required'
      }
    },
    name: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: 'Coin name is required'
      }
    },
    symbol: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: 'Coin symbol is required'
      }
    },
    image: {
      type: String,
      required: false // Make image optional
    }
  }],
  alerts: [{
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
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it's modified
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

const User = mongoose.model('User', userSchema);

export default User;