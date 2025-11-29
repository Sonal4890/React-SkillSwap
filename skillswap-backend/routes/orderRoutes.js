const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin, isLoggedInAdmin, isLoggedInUser } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/objectId');
const { 
  placeOrder, 
  processPayment,
  getMyOrders, 
  getOrderById,
  getAllOrders, 
  updateOrderStatus,
  getOrderStats
} = require('../controllers/orderController');

// @route   POST /api/orders
// @desc    Place order from cart
// @access  Private
router.post('/', isLoggedInUser, placeOrder);

// @route   POST /api/orders/payment
// @desc    Process payment for order
// @access  Private
router.post('/payment', isLoggedInUser, processPayment);

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', isLoggedInUser, getMyOrders);

// @route   GET /api/orders/stats
// @desc    Get order statistics
// @access  Private/Admin
router.get('/stats', isLoggedInAdmin, isAdmin, getOrderStats);

// @route   GET /api/orders/:orderId
// @desc    Get order by ID
// @access  Private
router.get('/:orderId', isLoggedInUser, validateObjectId('orderId'), getOrderById);

// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/admin/all', isLoggedInAdmin, isAdmin, getAllOrders);

// @route   PUT /api/orders/:id
// @desc    Update order status (Admin only)
// @access  Private/Admin
router.put('/:id', isLoggedInAdmin, isAdmin, validateObjectId('id'), updateOrderStatus);

module.exports = router;
