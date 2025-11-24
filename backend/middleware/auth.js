import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  // Check for token in cookies
  if (req.cookies.token) {
    try {
      // Verify token
      token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
      
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Export a dummy middleware for when database is not connected
const dummyProtect = (req, res, next) => {
  res.status(503).json({ 
    message: 'Service unavailable - Database not connected',
    suggestion: 'Please ensure MongoDB is running or check your MONGO_URI configuration'
  });
};

export { protect, dummyProtect };