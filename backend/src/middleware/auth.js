const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')
const User = require('../models/User')

const authMiddleware = {
  authenticate: async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Authorization header missing or invalid',
          error: 'UNAUTHORIZED'
        })
      }

      const token = authHeader.replace('Bearer ', '')

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token missing',
          error: 'UNAUTHORIZED'
        })
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        issuer: 'verichain-supply',
        audience: 'verichain-users'
      })

      // Get user from database
      const user = await User.getUserById(decoded.userId)

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
          error: 'UNAUTHORIZED'
        })
      }

      // Attach user to request
      req.user = user
      req.token = token

      logger.debug('User authenticated:', { userId: user.id, role: user.role })
      next()
    } catch (error) {
      logger.error('Authentication failed:', error.message)
      return res.status(401).json({
        success: false,
        message: 'Authentication failed',
        error: 'INVALID_TOKEN'
      })
    }
  },

  requireRole: (roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: 'UNAUTHORIZED'
        })
      }

      const userRole = req.user.role

      if (!roles.includes(userRole)) {
        logger.warn('Access denied for user:', {
          userId: req.user.id,
          role: userRole,
          requiredRoles: roles
        })
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
          error: 'FORBIDDEN'
        })
      }

      logger.debug('Access granted for user:', {
        userId: req.user.id,
        role: userRole
      })
      next()
    }
  },

  optionalAuth: async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '')

        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
          issuer: 'verichain-supply',
          audience: 'verichain-users'
        })

        const user = await User.getUserById(decoded.userId)
        req.user = user
      }

      next()
    } catch (error) {
      // Continue without authentication
      logger.debug('Optional authentication skipped:', error.message)
      next()
    }
  }
}

module.exports = authMiddleware
