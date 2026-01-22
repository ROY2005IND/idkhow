const { body, validationResult } = require('express-validator')
const logger = require('./logger')

const validators = {
  // Product validation rules
  productValidation: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 255 })
      .withMessage('Product name must be between 2 and 255 characters'),
    body('batchNumber')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Batch number is required and must be less than 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must be less than 1000 characters'),
    body('category')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Category must be less than 100 characters'),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('currency')
      .optional()
      .trim()
      .isLength({ min: 2, max: 10 })
      .withMessage('Currency code must be between 2 and 10 characters')
  ],

  // Event validation rules
  eventValidation: [
    body('productId')
      .isInt({ min: 1 })
      .withMessage('Product ID must be a positive integer'),
    body('eventType')
      .trim()
      .isIn(['Manufacturing', 'Warehouse', 'Shipping', 'Retail', 'Customer'])
      .withMessage('Event type must be one of: Manufacturing, Warehouse, Shipping, Retail, Customer'),
    body('location')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('Location must be less than 255 characters'),
    body('latitude')
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be between -90 and 90'),
    body('longitude')
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be between -180 and 180'),
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Notes must be less than 500 characters')
  ],

  // Handle validation results
  handleValidationErrors: (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      logger.warn('Validation failed:', errors.array())
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }
    next()
  }
}

module.exports = validators
