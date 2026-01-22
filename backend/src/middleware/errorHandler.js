const logger = require('../utils/logger')

const errorHandler = (err, req, res, next) => {
  logger.error('API Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  })

  // Mongoose/Database errors
  if (err.code === '23505') { // PostgreSQL unique constraint violation
    return res.status(400).json({
      success: false,
      message: 'Resource already exists',
      error: 'DUPLICATE_RESOURCE'
    })
  }

  if (err.code === '23503') { // PostgreSQL foreign key violation
    return res.status(400).json({
      success: false,
      message: 'Invalid reference',
      error: 'INVALID_REFERENCE'
    })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: 'INVALID_TOKEN'
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      error: 'TOKEN_EXPIRED'
    })
  }

  // Validation errors
  if (err.name === 'ValidationError' || err.name === 'TypeError') {
    return res.status(400).json({
      success: false,
      message: err.message,
      error: 'VALIDATION_ERROR'
    })
  }

  // Blockchain errors
  if (err.message.includes('Blockchain')) {
    return res.status(502).json({
      success: false,
      message: err.message,
      error: 'BLOCKCHAIN_ERROR'
    })
  }

  // Default error
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    error: err.errorCode || 'INTERNAL_SERVER_ERROR'
  })
}

module.exports = errorHandler
