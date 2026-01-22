const logger = require('../utils/logger')
const { query } = require('../config/database')

const analyticsController = {
  async getProductsByStatus (req, res) {
    try {
      const statusStats = await query(`
        SELECT 
          status,
          COUNT(*) as count,
          ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
        FROM products
        GROUP BY status
        ORDER BY count DESC
      `)

      res.json({
        success: true,
        message: 'Product status analytics retrieved successfully',
        data: { statusStats }
      })
    } catch (error) {
      logger.error('Failed to get product status analytics:', error.message)
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve product status analytics',
        error: 'INTERNAL_SERVER_ERROR'
      })
    }
  },

  async getProductsByCategory (req, res) {
    try {
      const categoryStats = await query(`
        SELECT 
          category,
          COUNT(*) as count,
          ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
        FROM products
        WHERE category IS NOT NULL AND category != ''
        GROUP BY category
        ORDER BY count DESC
        LIMIT 20
      `)

      res.json({
        success: true,
        message: 'Product category analytics retrieved successfully',
        data: { categoryStats }
      })
    } catch (error) {
      logger.error('Failed to get product category analytics:', error.message)
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve product category analytics',
        error: 'INTERNAL_SERVER_ERROR'
      })
    }
  },

  async getEventsByType (req, res) {
    try {
      const eventTypeStats = await query(`
        SELECT 
          event_type,
          COUNT(*) as count,
          COUNT(DISTINCT product_id) as unique_products,
          COUNT(DISTINCT actor_address) as unique_actors
        FROM events
        GROUP BY event_type
        ORDER BY count DESC
      `)

      res.json({
        success: true,
        message: 'Event type analytics retrieved successfully',
        data: { eventTypeStats }
      })
    } catch (error) {
      logger.error('Failed to get event type analytics:', error.message)
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve event type analytics',
        error: 'INTERNAL_SERVER_ERROR'
      })
    }
  },

  async getVerificationTrends (req, res) {
    try {
      const { days = 30 } = req.query

      const trends = await query(`
        SELECT 
          DATE(verified_at) as date,
          COUNT(*) as verification_count,
          COUNT(DISTINCT product_id) as unique_products,
          COUNT(DISTINCT verifier_address) as unique_verifiers
        FROM verification_logs
        WHERE verified_at >= CURRENT_DATE - INTERVAL '${days} days'
        GROUP BY DATE(verified_at)
        ORDER BY date ASC
      `)

      res.json({
        success: true,
        message: 'Verification trends retrieved successfully',
        data: { trends, period: `${days} days` }
      })
    } catch (error) {
      logger.error('Failed to get verification trends:', error.message)
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve verification trends',
        error: 'INTERNAL_SERVER_ERROR'
      })
    }
  },

  async getTopManufacturers (req, res) {
    try {
      const { limit = 10 } = req.query

      const topManufacturers = await query(`
        SELECT 
          manufacturer_address,
          COUNT(*) as product_count,
          MIN(created_at) as first_product_date,
          MAX(created_at) as last_product_date
        FROM products
        WHERE status = 'Active'
        GROUP BY manufacturer_address
        ORDER BY product_count DESC
        LIMIT $1
      `, [limit])

      res.json({
        success: true,
        message: 'Top manufacturers retrieved successfully',
        data: { manufacturers: topManufacturers }
      })
    } catch (error) {
      logger.error('Failed to get top manufacturers:', error.message)
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve top manufacturers',
        error: 'INTERNAL_SERVER_ERROR'
      })
    }
  }
}

module.exports = analyticsController
