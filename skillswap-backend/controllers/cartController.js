const Cart = require('../models/Cart');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Get current user's cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('courses.course', 'course_name price course_image instructor');
    
    if (!cart) {
      return res.status(200).json({ 
        success: true, 
        cart: { 
          user: req.user.id, 
          courses: [], 
          totalItems: 0, 
          totalAmount: 0 
        } 
      });
    }

    res.status(200).json({ 
      success: true, 
      cart 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching cart', 
      error: error.message 
    });
  }
};

// Add course to cart
const addToCart = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }

    // Check if user is already enrolled in this course
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId
    });

    if (enrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      cart = await Cart.create({ 
        user: req.user.id, 
        courses: [{ course: courseId }] 
      });
    } else {
      // Check if course is already in cart
      const existingCourse = cart.courses.find(
        item => item.course.toString() === courseId
      );
      
      if (existingCourse) {
        return res.status(400).json({
          success: false,
          message: 'Course is already in your cart'
        });
      }
      
      cart.courses.push({ course: courseId });
      await cart.save();
    }

    // Populate the cart data
    await cart.populate('courses.course', 'course_name price course_image instructor');

    res.status(200).json({ 
      success: true, 
      message: 'Course added to cart', 
      cart 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error adding to cart', 
      error: error.message 
    });
  }
};

// Remove course from cart
const removeFromCart = async (req, res) => {
  try {
    const { courseId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    // Remove the course from cart
    cart.courses = cart.courses.filter(
      item => item.course.toString() !== courseId
    );

    await cart.save();

    // Populate the cart data
    await cart.populate('courses.course', 'course_name price course_image instructor');

    res.status(200).json({ 
      success: true, 
      message: 'Course removed from cart', 
      cart 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error removing from cart', 
      error: error.message 
    });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    cart.courses = [];
    await cart.save();

    res.status(200).json({ 
      success: true, 
      message: 'Cart cleared', 
      cart 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error clearing cart', 
      error: error.message 
    });
  }
};

// Get cart count
const getCartCount = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    const count = cart ? cart.totalItems : 0;

    res.status(200).json({ 
      success: true, 
      count 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting cart count', 
      error: error.message 
    });
  }
};

module.exports = { 
  getCart, 
  addToCart, 
  removeFromCart, 
  clearCart,
  getCartCount 
};
