const Course = require('../models/Course');
const { validationResult } = require('express-validator');

// Helpers
const normalizeCourseName = (name = '') => name.trim().toLowerCase();

const dedupeCourses = (courses = []) => {
  const seen = new Set();
  return courses.filter(course => {
    const key = normalizeCourseName(course.course_name || course._id?.toString() || '');
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const getUniqueCourseTotal = async (filter = {}) => {
  const result = await Course.aggregate([
    { $match: filter },
    {
      $group: {
        _id: { $toLower: '$course_name' }
      }
    },
    { $count: 'count' }
  ]);
  return result[0]?.count || 0;
};

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
    
    // Search functionality - empty search returns default list
    if (search && search.trim() !== '') {
      filter.$or = [
        { course_name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    // Calculate pagination
    const limitNumber = Math.max(1, Number(limit));
    const pageNumber = Math.max(1, Number(page));
    const skip = (pageNumber - 1) * limitNumber;
    
    const [rawCourses, totalUnique] = await Promise.all([
      Course.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNumber),
      getUniqueCourseTotal(filter)
    ]);

    const courses = dedupeCourses(rawCourses);
    const totalPages = Math.max(1, Math.ceil(totalUnique / limitNumber));
    
    res.status(200).json({
      success: true,
      count: courses.length,
      total: totalUnique,
      totalPages,
      currentPage: pageNumber,
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
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0];
      return res.status(400).json({ 
        success: false, 
        message: firstError.msg 
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
      duration,
      level
    } = req.body;

    // Trim course_name to handle leading/trailing spaces
    const trimmedCourseName = course_name.trim();

    // Duplicate prevention by unique course_name (case-insensitive)
    const existing = await Course.findOne({ course_name: { $regex: `^${trimmedCourseName}$`, $options: 'i' } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A course with this name already exists' });
    }

    const course = await Course.create({
      course_name: trimmedCourseName,
      description,
      price,
      category,
      subcategory,
      course_image,
      instructor,
      duration,
      level
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
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0];
      return res.status(400).json({ 
        success: false, 
        message: firstError.msg 
      });
    }

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
      duration,
      level,
      isActive
    } = req.body;

    // Trim course_name to handle leading/trailing spaces
    const trimmedCourseName = course_name ? course_name.trim() : course.course_name;

    // Duplicate prevention when changing name
    if (course_name && trimmedCourseName.toLowerCase() !== course.course_name.toLowerCase()) {
      const existing = await Course.findOne({ course_name: { $regex: `^${trimmedCourseName}$`, $options: 'i' } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'A course with this name already exists' });
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { 
        course_name: trimmedCourseName, 
        description, 
        price, 
        category, 
        subcategory,
        course_image, 
        instructor,
        duration,
        level,
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
    const courses = dedupeCourses(
      await Course.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(6)
    );
    
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
    const courses = dedupeCourses(
      await Course.find({ isActive: true })
        .sort({ enrolledCount: -1, createdAt: -1 })
        .limit(6)
    );
    
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
    const limitNumber = Math.max(1, Number(limit));
    const pageNumber = Math.max(1, Number(page));
    const skip = (pageNumber - 1) * limitNumber;

    const baseFilter = { category: category, isActive: true };
    
    const [rawCourses, totalUnique] = await Promise.all([
      Course.find(baseFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),
      getUniqueCourseTotal(baseFilter)
    ]);

    const courses = dedupeCourses(rawCourses);
    const totalPages = Math.max(1, Math.ceil(totalUnique / limitNumber));
    
    res.status(200).json({
      success: true,
      count: courses.length,
      total: totalUnique,
      totalPages,
      category,
      currentPage: pageNumber,
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
    
    // Empty search is valid - return default list (no filter applied)
    if (!q || q.trim() === '') {
      return getAllCourses(req, res);
    }

    const limitNumber = Math.max(1, Number(limit));
    const pageNumber = Math.max(1, Number(page));
    const skip = (pageNumber - 1) * limitNumber;

    const searchFilter = {
      $and: [
        { isActive: true },
        {
          $or: [
            { course_name: { $regex: q.trim(), $options: 'i' } },
            { description: { $regex: q.trim(), $options: 'i' } },
            { instructor: { $regex: q.trim(), $options: 'i' } },
            { category: { $regex: q.trim(), $options: 'i' } },
            { subcategory: { $regex: q.trim(), $options: 'i' } }
          ]
        }
      ]
    };

    const [rawCourses, totalUnique] = await Promise.all([
      Course.find(searchFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),
      getUniqueCourseTotal(searchFilter)
    ]);

    const courses = dedupeCourses(rawCourses);
    const totalPages = Math.max(1, Math.ceil(totalUnique / limitNumber));
    
    res.status(200).json({
      success: true,
      count: courses.length,
      total: totalUnique,
      totalPages,
      currentPage: pageNumber,
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
