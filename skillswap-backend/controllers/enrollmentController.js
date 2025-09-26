const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Order = require('../models/Order');
const User = require('../models/User');

// Enroll in a course (after successful payment)
const enrollInCourse = async (req, res) => {
  try {
    const { courseId, orderId } = req.body;
    const userId = req.user.id;

    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }

    // Verify the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Verify the order exists and belongs to the user
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      status: 'completed'
    });

    if (!order) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order or order not completed'
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      order: orderId
    });

    // Update course enrolled count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { enrolledCount: 1 }
    });

    // Update user's enrolled courses
    await User.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: courseId }
    });

    // Populate the enrollment data
    await enrollment.populate('course', 'course_name instructor duration');

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error enrolling in course',
      error: error.message
    });
  }
};

// Get user's enrollments
const getUserEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const enrollments = await Enrollment.find({ user: userId })
      .populate('course', 'course_name instructor course_image duration level')
      .populate('order', 'finalAmount paymentStatus createdAt')
      .sort({ enrolledAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Enrollment.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      total,
      currentPage: Number(page),
      enrollments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching enrollments',
      error: error.message
    });
  }
};

// Get enrollment by ID
const getEnrollmentById = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      user: userId
    })
      .populate('course', 'course_name instructor course_image duration level description')
      .populate('order', 'finalAmount paymentStatus createdAt');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.status(200).json({
      success: true,
      enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching enrollment',
      error: error.message
    });
  }
};

// Update enrollment progress
const updateEnrollmentProgress = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { progress } = req.body;
    const userId = req.user.id;

    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be between 0 and 100'
      });
    }

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      user: userId
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    enrollment.progress = progress;
    
    // Mark as completed if progress is 100%
    if (progress === 100) {
      enrollment.completed = true;
      enrollment.completedAt = new Date();
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: 'Enrollment progress updated',
      enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating enrollment progress',
      error: error.message
    });
  }
};

// Check if user is enrolled in a course
const checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId
    });

    res.status(200).json({
      success: true,
      isEnrolled: !!enrollment,
      enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error checking enrollment',
      error: error.message
    });
  }
};

module.exports = {
  enrollInCourse,
  getUserEnrollments,
  getEnrollmentById,
  updateEnrollmentProgress,
  checkEnrollment
};
