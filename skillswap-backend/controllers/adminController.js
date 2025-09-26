const User = require('../models/User');
const Course = require('../models/Course');
const Order = require('../models/Order');

// Users
const listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error listing users', error: error.message });
  }
};

const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isBlocked = !user.isBlocked;
    await user.save();
    res.status(200).json({ success: true, message: user.isBlocked ? 'User blocked' : 'User unblocked', user: { id: user._id, isBlocked: user.isBlocked } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating user', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting user', error: error.message });
  }
};

// Stats
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, revenue: { $sum: '$totalAmount' } } }
    ]);
    const revenue = revenueAgg[0]?.revenue || 0;

    res.status(200).json({ success: true, stats: { totalUsers, totalCourses, totalOrders, revenue } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching stats', error: error.message });
  }
};

module.exports = { listUsers, toggleBlockUser, deleteUser, getStats };
