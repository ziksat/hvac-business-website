import { body, param, query } from 'express-validator';

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const customerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('zipCode').trim().notEmpty().withMessage('Zip code is required'),
];

export const serviceValidation = [
  body('name').trim().notEmpty().withMessage('Service name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 minute'),
];

export const blogPostValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('excerpt').trim().notEmpty().withMessage('Excerpt is required'),
];

export const testimonialValidation = [
  body('customerName').trim().notEmpty().withMessage('Customer name is required'),
  body('content').trim().notEmpty().withMessage('Testimonial content is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
];

export const serviceRequestValidation = [
  body('customerName').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('serviceType').trim().notEmpty().withMessage('Service type is required'),
  body('preferredDate').isISO8601().withMessage('Valid date is required'),
  body('message').optional().trim(),
];

export const equipmentValidation = [
  body('customerId').isInt().withMessage('Valid customer ID is required'),
  body('type').trim().notEmpty().withMessage('Equipment type is required'),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('installationDate').isISO8601().withMessage('Valid installation date is required'),
];

export const idParam = [
  param('id').isInt({ min: 1 }).withMessage('Valid ID is required'),
];

export const paginationQuery = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

export const searchQuery = [
  query('search').optional().trim(),
  ...paginationQuery,
];
