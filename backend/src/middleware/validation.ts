import { body, query, param } from 'express-validator';

// Authentication validation
export const validateRegister = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Please enter a valid phone number'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('role')
    .optional()
    .isIn(['customer', 'service_provider'])
    .withMessage('Role must be either customer or service_provider')
];

export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const validateBookingSlot = [
  body('slotId')
    .notEmpty()
    .withMessage('Slot ID is required')
    .isMongoId()
    .withMessage('Invalid slot ID format'),
  
  body('customerId')
    .optional()
    .isMongoId()
    .withMessage('Invalid customer ID format'),
  
  body('customerInfo')
    .optional()
    .isObject()
    .withMessage('Customer info must be an object'),
  
  body('customerInfo.name')
    .optional()
    .notEmpty()
    .withMessage('Customer name is required when providing customer info'),
  
  body('customerInfo.email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required when providing customer info'),
  
  body('customerInfo.phone')
    .optional()
    .notEmpty()
    .withMessage('Phone number is required when providing customer info'),
  
  body('customerInfo.address')
    .optional()
    .notEmpty()
    .withMessage('Address is required when providing customer info'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
  
  // Custom validation to ensure either customerId or customerInfo is provided
  body().custom((value) => {
    if (!value.customerId && !value.customerInfo) {
      throw new Error('Either customerId or customerInfo is required');
    }
    if (value.customerId && value.customerInfo) {
      throw new Error('Provide either customerId or customerInfo, not both');
    }
    return true;
  })
];

export const validateGetSlots = [
  query('serviceProviderId')
    .notEmpty()
    .withMessage('Service provider ID is required')
    .isMongoId()
    .withMessage('Invalid service provider ID format'),
  
  query('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Invalid date format')
];

export const validateBookingId = [
  param('bookingId')
    .notEmpty()
    .withMessage('Booking ID is required')
    .isMongoId()
    .withMessage('Invalid booking ID format')
];

export const validateUserId = [
  param('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID format')
];

export const validateServiceProviderId = [
  param('serviceProviderId')
    .notEmpty()
    .withMessage('Service provider ID is required')
    .isMongoId()
    .withMessage('Invalid service provider ID format')
];

export const validateCancelBooking = [
  body('reason')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Cancellation reason cannot exceed 500 characters')
];
