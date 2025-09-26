const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin } = require('../middleware/auth');
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
router.post('/', isLoggedIn, placeOrder);

// @route   POST /api/orders/payment
// @desc    Process payment for order
// @access  Private
router.post('/payment', isLoggedIn, processPayment);

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', isLoggedIn, getMyOrders);

// @route   GET /api/orders/stats
// @desc    Get order statistics
// @access  Private/Admin
router.get('/stats', isLoggedIn, isAdmin, getOrderStats);

// @route   GET /api/orders/:orderId
// @desc    Get order by ID
// @access  Private
router.get('/:orderId', isLoggedIn, validateObjectId('orderId'), getOrderById);

// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/admin/all', isLoggedIn, isAdmin, getAllOrders);

// @route   PUT /api/orders/:id
// @desc    Update order status (Admin only)
// @access  Private/Admin
router.put('/:id', isLoggedIn, isAdmin, validateObjectId('id'), updateOrderStatus);

module.exports = router;
