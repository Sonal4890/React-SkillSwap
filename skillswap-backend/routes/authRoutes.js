const express = require('express');
const router = express.Router();
const {getAllUsers, register, login, logout, getMe, requestAdminPasswordReset, resetAdminPassword } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { isLoggedInUser, isLoggedInAdmin } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegister, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, login);



router.get('/admin/get-all-users', isLoggedInAdmin, getAllUsers);



// @route   GET /api/auth/logout
// @desc    Logout user
// @access  Private
router.get('/logout', logout);

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', isLoggedInUser, getMe);

// Admin-only me endpoint uses admin token
router.get('/admin/me', isLoggedInAdmin, getMe);

// @route   POST /api/auth/admin/request-password-reset
// @desc    Generate admin password reset token (no email send)
// @access  Public (with user-enum safe response)
router.post('/admin/request-password-reset', requestAdminPasswordReset);

// @route   POST /api/auth/admin/reset-password/:token
// @desc    Reset admin password using token
// @access  Public
router.post('/admin/reset-password/:token', resetAdminPassword);




module.exports = router;
