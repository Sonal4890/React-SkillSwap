const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'skillswap_dev_secret_change_me';

// Middleware to check if user is logged in
const isLoggedIn = async (req, res, next) => {
	try {
		const token = req.cookies.token;

		if (!token) {
			return res.status(401).json({
				success: false,
				message: 'Access denied. No token provided.'
			});
		}

		const decoded = jwt.verify(token, JWT_SECRET);
		const user = await User.findById(decoded.id);

		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Invalid token. User not found.'
			});
		}

		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: 'Invalid token.'
		});
	}
};

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
	try {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				message: 'Access denied. Please login first.'
			});
		}

		if (!req.user.isAdmin) {
			return res.status(403).json({
				success: false,
				message: 'Access denied. Admin privileges required.'
			});
		}

		next();
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Server error in admin check.'
		});
	}
};

// Middleware to check if user is admin or instructor
const isAdminOrInstructor = async (req, res, next) => {
	try {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				message: 'Access denied. Please login first.'
			});
		}

		if (req.user.role !== 'admin' && req.user.role !== 'instructor') {
			return res.status(403).json({
				success: false,
				message: 'Access denied. Admin or Instructor privileges required.'
			});
		}

		next();
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Server error in admin/instructor check.'
		});
	}
};

module.exports = { isLoggedIn, isAdmin, isAdminOrInstructor };
