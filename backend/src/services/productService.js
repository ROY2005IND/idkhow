const logger = require('../utils/logger')
const { query, executeTransaction } = require('../config/database')
const blockchainService = require('./blockchainService')
const User = require('../models/User')

class ProductService {
  async createProduct (productData, manufacturerAddress) {
    return executeTransaction(async (client) => {
      // Verify manufacturer exists and has proper role
      const manufacturer = await User.getUserByWalletAddress(manufacturerAddress)
      if (!manufacturer) {
        throw new Error('Manufacturer not found in system')
      }

      // Register product on blockchain
      const blockchainResult = await blockchainService.registerProductOnChain(productData)

      // Save product metadata to database
      const queryText = `
        INSERT INTO products (
          product_id, blockchain_id, name, manufacturer_address, 
          batch_number, description, category, price, currency, 
          blockchain_tx_hash, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `

      const values = [
        blockchainResult.productId,
        blockchainResult.productId.toString(),
        productData.name,
        manufacturerAddress,
        productData.batchNumber,
        productData.description || '',
        productData.category || '',
        productData.price || null,
        productData.currency || 'USD',
        blockchainResult.txHash,
        'Active'
      ]

      const result = await client.query(queryText, values)
      const product = result.rows[0]

      logger.info('Product created successfully:', {
        productId: product.product_id,
        blockchainTxHash: product.blockchain_tx_hash
      })

      return {
        ...product,
        blockchainResult
      }
    })
  }

  async getProduct (productId) {
    try {
      // Get product from database
      const dbResult = await query(
        'SELECT * FROM products WHERE product_id = $1 AND status = $2',
        [productId, 'Active']
      )

      if (dbResult.length === 0) {
        throw new Error('Product not found')
      }

      const product = dbResult[0]

      // Sync with blockchain (optional, for verification)
      try {
        const blockchainProduct = await blockchainService.getProductFromChain(productId)
        if (!blockchainProduct.exists) {
          logger.warn('Product exists in DB but not on blockchain:', { productId })
        }
      } catch (blockchainError) {
        logger.warn('Could not sync with blockchain:', blockchainError.message)
      }

      // Get manufacturer details
      const manufacturer = await User.getUserByWalletAddress(product.manufacturer_address)

      return {
        ...product,
        manufacturer: manufacturer ? {
          walletAddress: manufacturer.wallet_address,
          email: manufacturer.email,
          username: manufacturer.username,
          role: manufacturer.role
        } : null
      }
    } catch (error) {
      logger.error('Failed to get product:', error.message)
      throw error
    }
  }

  async listProducts (filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        manufacturer,
        category,
        status = 'Active'
      } = filters

      const offset = (page - 1) * limit
      let queryText = 'SELECT * FROM products WHERE 1=1'
      const values = []
      let paramIndex = 1

      if (manufacturer) {
        queryText += ` AND manufacturer_address = $${paramIndex++}`
        values.push(manufacturer)
      }

      if (category) {
        queryText += ` AND category = $${paramIndex++}`
        values.push(category)
      }

      if (status) {
        queryText += ` AND status = $${paramIndex++}`
        values.push(status)
      }

      queryText += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`
      values.push(limit, offset)

      const products = await query(queryText, values)

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM products 
        WHERE 1=1 
        ${manufacturer ? 'AND manufacturer_address = $1' : ''}
        ${category ? `AND category = $${manufacturer ? 2 : 1}` : ''}
        ${status ? `AND status = $${manufacturer && category ? 3 : manufacturer || category ? 2 : 1}` : ''}
      `
      const countValues = values.filter((_, index) => index < values.length - 2)
      const countResult = await query(countQuery, countValues.length > 0 ? countValues : [])

      return {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult[0].total),
          pages: Math.ceil(countResult[0].total / limit)
        }
      }
    } catch (error) {
      logger.error('Failed to list products:', error.message)
      throw error
    }
  }

  async updateProduct (productId, updateData) {
    try {
      const fields = []
      const values = []
      let paramIndex = 1

      const allowedFields = ['name', 'description', 'category', 'price', 'currency', 'status', 'batch_number']

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
      values.push(productId)

      const queryText = `
        UPDATE products 
        SET ${fields.join(', ')} 
        WHERE product_id = $${paramIndex}
        RETURNING *
      `

      const result = await query(queryText, values)

      if (result.length === 0) {
        throw new Error('Product not found')
      }

      logger.info('Product updated successfully:', { productId })

      return result[0]
    } catch (error) {
      logger.error('Failed to update product:', error.message)
      throw error
    }
  }

  async getProductHistory (productId) {
    try {
      // Get blockchain history
      const blockchainHistory = await blockchainService.getProductHistoryFromChain(productId)

      // Get verification history from database
      const verificationHistory = await query(
        `SELECT * FROM verification_logs 
         WHERE product_id = $1 
         ORDER BY verified_at DESC`,
        [productId]
      )

      return {
        productId,
        blockchainEvents: blockchainHistory,
        verificationLogs: verificationHistory,
        totalEvents: blockchainHistory.length + verificationHistory.length
      }
    } catch (error) {
      logger.error('Failed to get product history:', error.message)
      throw error
    }
  }

  async archiveProduct (productId) {
    try {
      const result = await query(
        `UPDATE products 
         SET status = 'Archived', updated_at = CURRENT_TIMESTAMP 
         WHERE product_id = $1 
         RETURNING *`,
        [productId]
      )

      if (result.length === 0) {
        throw new Error('Product not found')
      }

      logger.info('Product archived successfully:', { productId })

      return result[0]
    } catch (error) {
      logger.error('Failed to archive product:', error.message)
      throw error
    }
  }
}

module.exports = new ProductService()
