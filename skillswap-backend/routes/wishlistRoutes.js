const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/objectId');
const { 
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlist
} = require('../controllers/wishlistController');

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', isLoggedIn, getWishlist);

// @route   POST /api/wishlist
// @desc    Add course to wishlist
// @access  Private
router.post('/', isLoggedIn, addToWishlist);

// @route   DELETE /api/wishlist/:courseId
// @desc    Remove course from wishlist
// @access  Private
router.delete('/:courseId', isLoggedIn, validateObjectId('courseId'), removeFromWishlist);

// @route   DELETE /api/wishlist
// @desc    Clear entire wishlist
// @access  Private
router.delete('/', isLoggedIn, clearWishlist);

// @route   GET /api/wishlist/check/:courseId
// @desc    Check if course is in wishlist
// @access  Private
router.get('/check/:courseId', isLoggedIn, validateObjectId('courseId'), checkWishlist);

module.exports = router;
