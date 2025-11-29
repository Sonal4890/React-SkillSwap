const express = require('express');
const router = express.Router();
const { isLoggedInUser } = require('../middleware/auth');
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
router.get('/', isLoggedInUser, getCart);

// @route   GET /api/cart/count
// @desc    Get cart item count
// @access  Private
router.get('/count', isLoggedInUser, getCartCount);

// @route   POST /api/cart
// @desc    Add course to cart
// @access  Private
router.post('/', isLoggedInUser, addToCart);

// @route   DELETE /api/cart/:courseId
// @desc    Remove course from cart
// @access  Private
router.delete('/:courseId', isLoggedInUser, validateObjectId('courseId'), removeFromCart);

// @route   DELETE /api/cart
// @desc    Clear entire cart
// @access  Private
router.delete('/', isLoggedInUser, clearCart);

module.exports = router;
