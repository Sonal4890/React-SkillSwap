const Course = require('../models/Course');
// Validation minimized: only non-empty and duplicate prevention will be enforced manually

// Get all courses with filtering, search, and pagination
const getAllCourses = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      subcategory, 
      search, 
      sort = 'createdAt',
      order = 'desc',
      minPrice,
      maxPrice,
      level
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (level) filter.level = level;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    // Search functionality
    if (search) {
      filter.$or = [
        { course_name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    const courses = await Course.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .populate('instructor', 'name email');

    const total = await Course.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      totalPages,
      currentPage: Number(page),
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching courses',
      error: error.message
    });
  }
};

// Get single course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching course',
      error: error.message
    });
  }
};

// Create new course (Admin/Instructor only)
const createCourse = async (req, res) => {
  try {
    const { 
      course_name, 
      description, 
      price, 
      category, 
      subcategory,
      course_image, 
      instructor,
      instructor_email,
      duration,
      level,
      language
    } = req.body;

    // Non-empty minimal checks
    if (!course_name || !description || price === undefined || price === null || !category) {
      return res.status(400).json({ success: false, message: 'Required fields are missing' });
    }

    // Duplicate prevention by unique course_name (case-insensitive)
    const existing = await Course.findOne({ course_name: { $regex: `^${course_name}$`, $options: 'i' } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Course with this name already exists' });
    }

    const course = await Course.create({
      course_name,
      description,
      price,
      category,
      subcategory,
      course_image,
      instructor,
      instructor_email,
      duration,
      level,
      language
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating course',
      error: error.message
    });
  }
};

// Update course (Admin/Instructor only)
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const { 
      course_name, 
      description, 
      price, 
      category, 
      subcategory,
      course_image, 
      instructor,
      instructor_email,
      duration,
      level,
      language,
      isActive
    } = req.body;
    // Non-empty minimal checks (only for provided fields)
    if (course_name !== undefined && !course_name) return res.status(400).json({ success: false, message: 'Course name cannot be empty' });
    if (description !== undefined && !description) return res.status(400).json({ success: false, message: 'Description cannot be empty' });
    if (category !== undefined && !category) return res.status(400).json({ success: false, message: 'Category cannot be empty' });

    // Duplicate prevention when changing name
    if (course_name && course_name.toLowerCase() !== course.course_name.toLowerCase()) {
      const existing = await Course.findOne({ course_name: { $regex: `^${course_name}$`, $options: 'i' } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Course with this name already exists' });
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { 
        course_name, 
        description, 
        price, 
        category, 
        subcategory,
        course_image, 
        instructor,
        instructor_email,
        duration,
        level,
        language,
        isActive
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating course',
      error: error.message
    });
  }
};

// Delete course (Admin only)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting course',
      error: error.message
    });
  }
};

// Get latest courses (for home page)
const getLatestCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(6);
    
    res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching latest courses',
      error: error.message
    });
  }
};

// Get trending courses (most enrolled)
const getTrendingCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true })
      .sort({ enrolledCount: -1, createdAt: -1 })
      .limit(6);
    
    res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching trending courses',
      error: error.message
    });
  }
};

// Get courses by category
const getCoursesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;
    
    const skip = (page - 1) * limit;
    
    const courses = await Course.find({ 
      category: category,
      isActive: true 
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Course.countDocuments({ 
      category: category,
      isActive: true 
    });
    
    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      category,
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching courses by category',
      error: error.message
    });
  }
};

// Search courses
const searchCourses = async (req, res) => {
  try {
    const { q, page = 1, limit = 12 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const skip = (page - 1) * limit;
    
    const courses = await Course.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { course_name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { instructor: { $regex: q, $options: 'i' } },
            { category: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Course.countDocuments({
      $and: [
        { isActive: true },
        {
          $or: [
            { course_name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { instructor: { $regex: q, $options: 'i' } },
            { category: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      query: q,
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error searching courses',
      error: error.message
    });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getLatestCourses,
  getTrendingCourses,
  getCoursesByCategory,
  searchCourses
};
