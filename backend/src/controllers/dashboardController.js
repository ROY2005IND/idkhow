const logger = require('../utils/logger')
const ProductService = require('../services/productService')
const EventService = require('../services/eventService')
const { query } = require('../config/database')

const dashboardController = {
  async getStats (req, res) {
    try {
      // Get product statistics
      const productStats = await query(`
        SELECT 
          COUNT(*) as total_products,
          COUNT(DISTINCT manufacturer_address) as total_manufacturers,
          COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_products,
          COUNT(CASE WHEN status = 'Archived' THEN 1 END) as archived_products
        FROM products
      `)

      // Get event statistics
      const eventStats = await query(`
        SELECT COUNT(*) as total_events
        FROM events
      `)

      // Get verification statistics
      const verificationStats = await query(`
        SELECT 
          COUNT(*) as total_verifications,
          COUNT(DISTINCT product_id) as verified_products,
          COUNT(DISTINCT verifier_address) as unique_verifiers
        FROM verification_logs
        WHERE verified_at >= CURRENT_DATE - INTERVAL '30 days'
      `)

      // Get recent activity (last 7 days)
      const recentActivity = await query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as activity_count
        FROM (
          SELECT created_at FROM products
          UNION ALL
          SELECT created_at FROM events
          UNION ALL
          SELECT verified_at as created_at FROM verification_logs
        ) all_activity
        WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `)

      const stats = {
        products: productStats[0],
        events: eventStats[0],
        verifications: verificationStats[0],
        recentActivity,
        lastUpdated: new Date().toISOString()
      }

      res.json({
        success: true,
        message: 'Dashboard statistics retrieved successfully',
        data: stats
      })
    } catch (error) {
      logger.error('Failed to get dashboard stats:', error.message)
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve dashboard statistics',
        error: 'INTERNAL_SERVER_ERROR'
      })
    }
  },

  async getRecentProducts (req, res) {
    try {
      const { limit = 10 } = req.query

      const queryText = `
        SELECT p.*, u.username as manufacturer_username
        FROM products p
        LEFT JOIN users u ON p.manufacturer_address = u.wallet_address
        WHERE p.status = 'Active'
        ORDER BY p.created_at DESC
        LIMIT $1
      `

      const products = await query(queryText, [limit])

      res.json({
        success: true,
        message: 'Recent products retrieved successfully',
        data: { products }
      })
    } catch (error) {
      logger.error('Failed to get recent products:', error.message)
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve recent products',
        error: 'INTERNAL_SERVER_ERROR'
      })
    }
  },

  async getRecentEvents (req, res) {
    try {
      const { limit = 10 } = req.query

      const recentEvents = await EventService.getRecentEvents(limit)

      res.json({
        success: true,
        message: 'Recent events retrieved successfully',
        data: { events: recentEvents }
      })
    } catch (error) {
      logger.error('Failed to get recent events:', error.message)
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve recent events',
        error: 'INTERNAL_SERVER_ERROR'
      })
    }
  }
}

module.exports = dashboardController
