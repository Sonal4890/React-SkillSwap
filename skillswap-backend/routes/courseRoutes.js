const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getLatestCourses,
  getTrendingCourses,
  getCoursesByCategory,
  searchCourses
} = require('../controllers/courseController');
// Course input validation intentionally minimized per requirements
const { isLoggedIn, isAdmin, isAdminOrInstructor } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/objectId');

// @route   GET /api/courses
// @desc    Get all courses with filtering, search, and pagination
// @access  Public
router.get('/', getAllCourses);

// @route   GET /api/courses/latest
// @desc    Get latest 6 courses
// @access  Public
router.get('/latest', getLatestCourses);

// @route   GET /api/courses/trending
// @desc    Get trending courses (most enrolled)
// @access  Public
router.get('/trending', getTrendingCourses);

// @route   GET /api/courses/search
// @desc    Search courses
// @access  Public
router.get('/search', searchCourses);

// @route   GET /api/courses/category/:category
// @desc    Get courses by category
// @access  Public
router.get('/category/:category', getCoursesByCategory);

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get('/:id', validateObjectId('id'), getCourseById);

// @route   POST /api/courses
// @desc    Create new course
// @access  Private/Admin/Instructor
router.post('/', isLoggedIn, isAdminOrInstructor, createCourse);

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private/Admin/Instructor
router.put('/:id', isLoggedIn, isAdminOrInstructor, validateObjectId('id'), updateCourse);

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private/Admin
router.delete('/:id', isLoggedIn, isAdmin, validateObjectId('id'), deleteCourse);

module.exports = router;
