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
    .custom((value) => {
      if (value.length < 3) {
        throw new Error('Course name must be atleast 3 characters');
      }
      if (value.length > 150) {
        throw new Error('Course name is too long');
      }
      // Ensure it contains at least one letter (not just numbers or special characters)
      if (!/[a-zA-Z]/.test(value)) {
        throw new Error('Course name must contain at least one letter');
      }
      return true;
    }),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .custom((value) => {
      if (value.length < 10) {
        throw new Error('Description is too short');
      }
      if (value.length > 5000) {
        throw new Error('Description is too long');
      }
      return true;
    }),
  
  body('price')
    .custom((value) => {
      if (value === '' || value === null || value === undefined) {
        throw new Error('Price is required');
      }
      // Convert to number
      const numValue = Number(value);
      if (isNaN(numValue)) {
        throw new Error('Please enter a valid number');
      }
      if (numValue < 0) {
        throw new Error('Price must be 0 or greater');
      }
      // Check for very large numbers (edge case)
      if (numValue > 100000000000) {
        throw new Error('Price is too large');
      }
      return true;
    }),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .custom((value) => {
      const validCategories = ['development', 'business', 'it', 'finance', 'marketing', 'design', 'data-science', 'ai-ml', 'other'];
      // Support comma-separated tags
      const categories = value.split(',').map(c => c.trim()).filter(c => c);
      const invalidCategories = categories.filter(c => !validCategories.includes(c));
      if (invalidCategories.length > 0) {
        throw new Error('Please select a valid category');
      }
      return true;
    }),
  
  body('subcategory')
    .notEmpty()
    .withMessage('Subcategory is required')
    .trim()
    .isLength({ max: 50 })
    .withMessage('Subcategory must be less than 50 characters'),
  
  body('course_image')
    .notEmpty()
    .withMessage('Course image is required')
    .custom((value) => {
      if (!value) {
        throw new Error('Course image is required');
      }
      // Check if it's a valid URL (http/https)
      const urlPattern = /^https?:\/\/.+/i;
      // Check if it's a valid data URL (data:image/...)
      const dataUrlPattern = /^data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,.+/i;
      if (urlPattern.test(value) || dataUrlPattern.test(value)) {
        return true;
      }
      throw new Error('Course image must be a valid URL or image file');
    }),
  
  body('duration')
    .notEmpty()
    .withMessage('Duration is required')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Duration must be between 1 and 50 characters'),
  
  body('instructor')
    .trim()
    .notEmpty()
    .withMessage('Instructor name is required')
    .custom((value) => {
      if (value.length < 3) {
        throw new Error('Instructor name must be atleast 3 characters');
      }
      if (value.length > 50) {
        throw new Error('Instructor name must be less than 50 characters');
      }
      // Ensure it contains at least one letter (not just numbers or special characters)
      if (!/[a-zA-Z]/.test(value)) {
        throw new Error('Instructor name must contain at least one letter');
      }
      return true;
    }),
  
  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid level selected'),
  
  body('language')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Language must be less than 30 characters')
];

module.exports = {
  validateRegister,
  validateLogin,
  validateCourse
};
