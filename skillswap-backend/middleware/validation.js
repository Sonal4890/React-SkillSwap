const { body } = require('express-validator');

// Validation for user registration
const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
];

// Validation for user login
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation for course creation/update
const validateCourse = [
  body('course_name')
    .trim()
    .notEmpty()
    .withMessage('Course name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Course name must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Course description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative'),
  
  body('category')
    .notEmpty()
    .withMessage('Course category is required')
    .isIn(['development', 'business', 'it', 'marketing', 'design', 'data-science', 'ai-ml', 'other'])
    .withMessage('Invalid category selected'),
  
  body('course_image')
    .optional()
    .isURL()
    .withMessage('Course image must be a valid URL'),
  
  body('instructor')
    .trim()
    .notEmpty()
    .withMessage('Instructor name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Instructor name must be between 2 and 50 characters'),
  
  body('instructor_email')
    .isEmail()
    .withMessage('Please enter a valid instructor email')
    .normalizeEmail(),
  
  body('duration')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Duration must be less than 50 characters'),
  
  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid level selected'),
  
  body('language')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Language must be less than 30 characters'),
  
  body('subcategory')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Subcategory must be less than 50 characters')
];

module.exports = {
  validateRegister,
  validateLogin,
  validateCourse
};
