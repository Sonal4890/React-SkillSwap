const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/objectId');
const { 
  enrollInCourse,
  getUserEnrollments,
  getEnrollmentById,
  updateEnrollmentProgress,
  checkEnrollment
} = require('../controllers/enrollmentController');

// @route   POST /api/enrollments
// @desc    Enroll in a course (after payment)
// @access  Private
router.post('/', isLoggedIn, enrollInCourse);

// @route   GET /api/enrollments
// @desc    Get user's enrollments
// @access  Private
router.get('/', isLoggedIn, getUserEnrollments);

// @route   GET /api/enrollments/:enrollmentId
// @desc    Get enrollment by ID
// @access  Private
router.get('/:enrollmentId', isLoggedIn, validateObjectId('enrollmentId'), getEnrollmentById);

// @route   PUT /api/enrollments/:enrollmentId/progress
// @desc    Update enrollment progress
// @access  Private
router.put('/:enrollmentId/progress', isLoggedIn, validateObjectId('enrollmentId'), updateEnrollmentProgress);

// @route   GET /api/enrollments/check/:courseId
// @desc    Check if user is enrolled in a course
// @access  Private
router.get('/check/:courseId', isLoggedIn, validateObjectId('courseId'), checkEnrollment);

module.exports = router;
