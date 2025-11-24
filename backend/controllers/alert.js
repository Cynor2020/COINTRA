import User from '../models/User.js';

// @desc    Get user alerts
// @route   GET /api/alerts
// @access  Private
const getAlerts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json(user.alerts);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create alert
// @route   POST /api/alerts/create
// @access  Private
const createAlert = async (req, res, next) => {
  const { coinId, coinName, targetPrice } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (user) {
      // Add alert to user
      user.alerts.push({
        coinId,
        coinName,
        targetPrice,
      });

      const updatedUser = await user.save();
      res.status(201).json(updatedUser.alerts);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete alert
// @route   DELETE /api/alerts/delete/:id
// @access  Private
const deleteAlert = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      // Remove alert from user
      user.alerts = user.alerts.filter(
        (alert) => alert._id.toString() !== req.params.id
      );

      const updatedUser = await user.save();
      res.json(updatedUser.alerts);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update alert status
// @route   PUT /api/alerts/status/:id
// @access  Private
const updateAlertStatus = async (req, res, next) => {
  const { status } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (user) {
      // Find alert and update status
      const alert = user.alerts.find(
        (alert) => alert._id.toString() === req.params.id
      );

      if (alert) {
        alert.status = status;
        const updatedUser = await user.save();
        res.json(updatedUser.alerts);
      } else {
        res.status(404).json({ message: 'Alert not found' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating alert status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { getAlerts, createAlert, deleteAlert, updateAlertStatus };