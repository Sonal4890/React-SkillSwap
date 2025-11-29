const mongoose = require('mongoose');
const Course = require('../models/Course');
const { body } = require('express-validator');

const validateObjectId = (paramName = 'id') => (req, res, next) => {
  const id = req.params[paramName];
  if (!id || id === '') {
    return res.status(400).json({ success: false, message: 'Invalid course id' });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid course id' });
  }
  next();
};

// Validate course ID and check if course exists
const validateCourseId = async (req, res, next) => {
  try {
    const courseId = req.params.id || req.body.courseId;
    
    if (!courseId || courseId === '') {
      return res.status(400).json({ success: false, message: 'Invalid course id' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid course id' });
    }
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error validating course', error: error.message });
  }
};

// Validate quantity for cart (if needed in future)
const validateQuantity = [
  body('quantity')
    .custom((value) => {
      if (value === '' || value === null || value === undefined) {
        throw new Error('Quantity is required');
      }
      const numValue = Number(value);
      if (isNaN(numValue)) {
        throw new Error('Quantity must be a positive number');
      }
      if (numValue < 1) {
        throw new Error('Quantity must be atleast 1');
      }
      if (numValue < 0) {
        throw new Error('Quantity must be a positive number');
      }
      return true;
    })
];

module.exports = { validateObjectId, validateCourseId, validateQuantity };
