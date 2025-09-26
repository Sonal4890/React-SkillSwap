const Wishlist = require('../models/Wishlist');
const Course = require('../models/Course');

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate('courses.course', 'course_name price course_image instructor category');
    
    if (!wishlist) {
      return res.status(200).json({ 
        success: true, 
        wishlist: { 
          user: req.user.id, 
          courses: [] 
        } 
      });
    }

    res.status(200).json({ 
      success: true, 
      wishlist 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching wishlist', 
      error: error.message 
    });
  }
};

// Add course to wishlist
const addToWishlist = async (req, res) => {
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

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ 
        user: req.user.id, 
        courses: [{ course: courseId }] 
      });
    } else {
      // Check if course is already in wishlist
      const existingCourse = wishlist.courses.find(
        item => item.course.toString() === courseId
      );
      
      if (existingCourse) {
        return res.status(400).json({
          success: false,
          message: 'Course is already in your wishlist'
        });
      }
      
      wishlist.courses.push({ course: courseId });
      await wishlist.save();
    }

    // Populate the wishlist data
    await wishlist.populate('courses.course', 'course_name price course_image instructor category');

    res.status(200).json({ 
      success: true, 
      message: 'Course added to wishlist', 
      wishlist 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error adding to wishlist', 
      error: error.message 
    });
  }
};

// Remove course from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { courseId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ 
        success: false, 
        message: 'Wishlist not found' 
      });
    }

    // Remove the course from wishlist
    wishlist.courses = wishlist.courses.filter(
      item => item.course.toString() !== courseId
    );

    await wishlist.save();

    // Populate the wishlist data
    await wishlist.populate('courses.course', 'course_name price course_image instructor category');

    res.status(200).json({ 
      success: true, 
      message: 'Course removed from wishlist', 
      wishlist 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error removing from wishlist', 
      error: error.message 
    });
  }
};

// Clear entire wishlist
const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ 
        success: false, 
        message: 'Wishlist not found' 
      });
    }

    wishlist.courses = [];
    await wishlist.save();

    res.status(200).json({ 
      success: true, 
      message: 'Wishlist cleared', 
      wishlist 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error clearing wishlist', 
      error: error.message 
    });
  }
};

// Check if course is in wishlist
const checkWishlist = async (req, res) => {
  try {
    const { courseId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(200).json({ 
        success: true, 
        inWishlist: false 
      });
    }

    const inWishlist = wishlist.courses.some(
      item => item.course.toString() === courseId
    );

    res.status(200).json({ 
      success: true, 
      inWishlist 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error checking wishlist', 
      error: error.message 
    });
  }
};

module.exports = { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist,
  checkWishlist 
};
