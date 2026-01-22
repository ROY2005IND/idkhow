const logger = require('../utils/logger')
const { query, executeTransaction } = require('../config/database')
const blockchainService = require('./blockchainService')
const User = require('../models/User')

class EventService {
  async logEvent (eventData, actorAddress) {
    return executeTransaction(async (client) => {
      // Verify actor exists
      const actor = await User.getUserByWalletAddress(actorAddress)
      if (!actor) {
        throw new Error('Actor not found in system')
      }

      // Log event on blockchain
      const blockchainResult = await blockchainService.addSupplyChainEventOnChain({
        ...eventData,
        actorAddress
      })

      // Save event metadata to database
      const queryText = `
        INSERT INTO events (
          event_id, product_id, event_type, location, 
          latitude, longitude, timestamp, actor_address, 
          notes, blockchain_tx_hash
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `

      const values = [
        null, // event_id will be auto-generated or null for now
        eventData.productId,
        eventData.eventType,
        eventData.location || '',
        eventData.latitude || null,
        eventData.longitude || null,
        eventData.timestamp || Math.floor(Date.now() / 1000),
        actorAddress,
        eventData.notes || '',
        blockchainResult.txHash
      ]

      const result = await client.query(queryText, values)
      const event = result.rows[0]

      logger.info('Supply chain event logged successfully:', {
        productId: event.product_id,
        eventType: event.event_type,
        blockchainTxHash: event.blockchain_tx_hash
      })

      return {
        ...event,
        blockchainResult
      }
    })
  }

  async getProductEvents (productId, filters = {}) {
    try {
      const { eventType, actorAddress, page = 1, limit = 50 } = filters

      const offset = (page - 1) * limit
      let queryText = `
        SELECT e.*, u.username as actor_username, u.role as actor_role
        FROM events e
        LEFT JOIN users u ON e.actor_address = u.wallet_address
        WHERE e.product_id = $1
      `
      const values = [productId]
      let paramIndex = 2

      if (eventType) {
        queryText += ` AND e.event_type = $${paramIndex++}`
        values.push(eventType)
      }

      if (actorAddress) {
        queryText += ` AND e.actor_address = $${paramIndex++}`
        values.push(actorAddress)
      }

      queryText += ` ORDER BY e.timestamp ASC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`
      values.push(limit, offset)

      const events = await query(queryText, values)

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM events 
        WHERE product_id = $1
        ${eventType ? 'AND event_type = $2' : ''}
        ${actorAddress ? `AND actor_address = $${eventType ? 3 : 2}` : ''}
      `
      const countValues = [productId]
      if (eventType) countValues.push(eventType)
      if (actorAddress) countValues.push(actorAddress)
      const countResult = await query(countQuery, countValues)

      return {
        events,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult[0].total),
          pages: Math.ceil(countResult[0].total / limit)
        }
      }
    } catch (error) {
      logger.error('Failed to get product events:', error.message)
      throw error
    }
  }

  async getEventTimeline (productId) {
    try {
      // Get all events for the product, ordered by timestamp
      const queryText = `
        SELECT e.*, u.username as actor_username, u.role as actor_role
        FROM events e
        LEFT JOIN users u ON e.actor_address = u.wallet_address
        WHERE e.product_id = $1
        ORDER BY e.timestamp ASC
      `

      const events = await query(queryText, [productId])

      // Group events by stage for timeline view
      const stages = {
        Manufacturing: [],
        Warehouse: [],
        Shipping: [],
        Retail: [],
        Customer: []
      }

      events.forEach(event => {
        const stage = stages[event.event_type]
        if (stage) {
          stage.push(event)
        }
      })

      // Calculate time spent at each stage
      const timeline = Object.keys(stages).map(stage => ({
        stage,
        events: stages[stage],
        eventCount: stages[stage].length,
        firstEvent: stages[stage][0] || null,
        lastEvent: stages[stage][stages[stage].length - 1] || null
      }))

      return {
        productId,
        timeline,
        totalEvents: events.length,
        firstEvent: events[0] || null,
        lastEvent: events[events.length - 1] || null
      }
    } catch (error) {
      logger.error('Failed to get event timeline:', error.message)
      throw error
    }
  }

  async getSupplyChainStats () {
    try {
      // Get total events
      const totalEventsResult = await query('SELECT COUNT(*) as total FROM events')
      const totalEvents = parseInt(totalEventsResult[0].total)

      // Get events by type
      const eventsByTypeResult = await query(`
        SELECT event_type, COUNT(*) as count 
        FROM events 
        GROUP BY event_type 
        ORDER BY count DESC
      `)

      // Get active products count
      const activeProductsResult = await query(`
        SELECT COUNT(DISTINCT product_id) as count 
        FROM events
      `)
      const activeProducts = parseInt(activeProductsResult[0].count)

      // Get most active actors
      const topActorsResult = await query(`
        SELECT actor_address, COUNT(*) as event_count
        FROM events
        GROUP BY actor_address
        ORDER BY event_count DESC
        LIMIT 10
      `)

      // Get recent activity (last 30 days)
      const recentActivityResult = await query(`
        SELECT 
          DATE(to_timestamp(timestamp)) as date,
          COUNT(*) as event_count
        FROM events
        WHERE timestamp >= EXTRACT(EPOCH FROM (CURRENT_DATE - INTERVAL '30 days'))
        GROUP BY DATE(to_timestamp(timestamp))
        ORDER BY date DESC
      `)

      return {
        totalEvents,
        eventsByType: eventsByTypeResult,
        activeProducts,
        topActors: topActorsResult,
        recentActivity: recentActivityResult,
        lastUpdated: new Date().toISOString()
      }
    } catch (error) {
      logger.error('Failed to get supply chain stats:', error.message)
      throw error
    }
  }

  async getRecentEvents (limit = 20) {
    try {
      const queryText = `
        SELECT e.*, p.name as product_name, u.username as actor_username
        FROM events e
        JOIN products p ON e.product_id = p.product_id
        LEFT JOIN users u ON e.actor_address = u.wallet_address
        ORDER BY e.created_at DESC
        LIMIT $1
      `

      const events = await query(queryText, [limit])

      return events
    } catch (error) {
      logger.error('Failed to get recent events:', error.message)
      throw error
    }
  }

  async getEventById (eventId) {
    try {
      const queryText = `
        SELECT e.*, u.username as actor_username, u.role as actor_role,
               p.name as product_name
        FROM events e
        LEFT JOIN users u ON e.actor_address = u.wallet_address
        JOIN products p ON e.product_id = p.product_id
        WHERE e.id = $1
      `

      const result = await query(queryText, [eventId])

      if (result.length === 0) {
        throw new Error('Event not found')
      }

      return result[0]
    } catch (error) {
      logger.error('Failed to get event by ID:', error.message)
      throw error
    }
  }

  async updateEvent (eventId, updateData) {
    try {
      const fields = []
      const values = []
      let paramIndex = 1

      const allowedFields = ['location', 'latitude', 'longitude', 'notes']

      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key)) {
          fields.push(`${key} = $${paramIndex++}`)
          values.push(updateData[key])
        }
      })

      if (fields.length === 0) {
        throw new Error('No valid fields to update')
      }

      fields.push(`updated_at = CURRENT_TIMESTAMP`)
      values.push(eventId)

      const queryText = `
        UPDATE events 
        SET ${fields.join(', ')} 
        WHERE id = $${paramIndex}
        RETURNING *
      `

      const result = await query(queryText, values)

      if (result.length === 0) {
        throw new Error('Event not found')
      }

      logger.info('Event updated successfully:', { eventId })

      return result[0]
    } catch (error) {
      logger.error('Failed to update event:', error.message)
      throw error
    }
  }
}

module.exports = new EventService()
