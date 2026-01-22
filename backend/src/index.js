const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { RateLimiterMemory } = require('rate-limiter-flexible')

const { connectDB } = require('./config/database')
const { initializeBlockchain } = require('./config/blockchain')
const { validateEnv } = require('./config/env')
const errorHandler = require('./middleware/errorHandler')

const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')
const eventRoutes = require('./routes/events')
const verifyRoutes = require('./routes/verify')

const logger = require('./utils/logger')

const app = express()

// Initialize rate limiter
const rateLimiter = new RateLimiterMemory({
  keyPrefix: 'verichain_rate_limit',
  points: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  duration: (process.env.RATE_LIMIT_WINDOW_MS || 900000) / 1000 // Convert to seconds
})

// Rate limiting middleware
const rateLimitMiddleware = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip)
    next()
  } catch (rateLimiterRes) {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later',
      error: 'RATE_LIMIT_EXCEEDED'
    })
  }
}

// Validate environment variables
try {
  validateEnv()
  logger.info('Environment variables validated successfully')
} catch (error) {
  logger.error('Environment validation failed:', error.message)
  process.exit(1)
}

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(rateLimitMiddleware)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'VeriChain Supply API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.API_VERSION || 'v1'
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/verify', verifyRoutes)

// Dashboard routes (for future Phase 2 expansion)
app.get('/api/dashboard/stats', require('./controllers/dashboardController').getStats)
app.get('/api/dashboard/recent-products', require('./controllers/dashboardController').getRecentProducts)
app.get('/api/dashboard/recent-events', require('./controllers/dashboardController').getRecentEvents)

// Analytics routes
app.get('/api/analytics/products-by-status', require('./controllers/analyticsController').getProductsByStatus)

// Error handling middleware (must be last)
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    error: 'NOT_FOUND'
  })
})

async function startServer () {
  try {
    // Connect to database
    await connectDB()
    logger.info('Database connected successfully')

    // Initialize blockchain connection
    await initializeBlockchain()
    logger.info('Blockchain service initialized')

    // Start server
    const port = process.env.PORT || 5000
    const server = app.listen(port, () => {
      logger.info(`Server running on port ${port}`)
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
      logger.info(`Health check: http://localhost:${port}/api/health`)
    })

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      logger.info(`Received ${signal}, starting graceful shutdown...`)
      logger.info('Closing HTTP server...')
      server.close(() => {
        logger.info('HTTP server closed')
        logger.info('Closing database connections...')
        process.exit(0)
      })
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))

  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

module.exports = app
