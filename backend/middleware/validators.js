import { body, validationResult } from 'express-validator';

// Middleware to check validation results
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }
  next();
};

// Registration validation
export const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/).withMessage('Please provide a valid phone number'),
  
  body('age')
    .optional()
    .isInt({ min: 13, max: 120 }).withMessage('Age must be between 13 and 120'),
  
  body('fitnessLevel')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced']).withMessage('Fitness level must be beginner, intermediate, or advanced'),
  
  body('goal')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Goal cannot exceed 200 characters'),
  
  validate
];

// Login validation
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  validate
];

// Profile update validation
export const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please provide a valid phone number'),
  
  body('age')
    .optional()
    .isInt({ min: 13, max: 120 }).withMessage('Age must be between 13 and 120'),
  
  body('fitnessLevel')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced']).withMessage('Fitness level must be beginner, intermediate, or advanced'),
  
  body('goal')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Goal cannot exceed 200 characters'),
  
  validate
];

// Plan creation validation
export const validatePlanCreate = [
  body('planName')
    .trim()
    .notEmpty().withMessage('Plan name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Plan name must be between 3-100 characters'),
  
  body('yogaType')
    .trim()
    .notEmpty().withMessage('Yoga type is required')
    .isLength({ max: 50 }).withMessage('Yoga type cannot exceed 50 characters'),
  
  body('meditationTime')
    .notEmpty().withMessage('Meditation time is required')
    .isInt({ min: 1, max: 180 }).withMessage('Meditation time must be between 1-180 minutes'),
  
  body('durationWeeks')
    .notEmpty().withMessage('Duration is required')
    .isInt({ min: 1, max: 52 }).withMessage('Duration must be between 1-52 weeks'),
  
  body('dailySchedule')
    .optional()
    .isArray().withMessage('Daily schedule must be an array'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters'),
  
  validate
];

// Email validation
export const validateEmail = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  validate
];

// Password reset validation
export const validatePasswordReset = [
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  validate
];
