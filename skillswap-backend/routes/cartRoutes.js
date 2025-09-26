const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/objectId');
const { 
  getCart, 
  addToCart, 
  removeFromCart, 
  clearCart,
  getCartCount 
} = require('../controllers/cartController');

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', isLoggedIn, getCart);

// @route   GET /api/cart/count
// @desc    Get cart item count
// @access  Private
router.get('/count', isLoggedIn, getCartCount);

// @route   POST /api/cart
// @desc    Add course to cart
// @access  Private
router.post('/', isLoggedIn, addToCart);

// @route   DELETE /api/cart/:courseId
// @desc    Remove course from cart
// @access  Private
router.delete('/:courseId', isLoggedIn, validateObjectId('courseId'), removeFromCart);

// @route   DELETE /api/cart
// @desc    Clear entire cart
// @access  Private
router.delete('/', isLoggedIn, clearCart);

module.exports = router;
