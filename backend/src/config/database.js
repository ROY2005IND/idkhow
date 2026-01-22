const { Pool } = require('pg')
const logger = require('../utils/logger')

let pool = null

async function connectDB () {
  if (pool) {
    return pool
  }

  try {
    if (process.env.DATABASE_URL) {
      // Use connection string if provided
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      })
    } else {
      // Use individual connection parameters
      pool = new Pool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      })
    }

    // Test connection
    const client = await pool.connect()
    logger.info('PostgreSQL database connected successfully')
    client.release()

    // Handle connection errors
    pool.on('error', (err) => {
      logger.error('Database pool error:', err)
    })

    return pool
  } catch (error) {
    logger.error('Database connection failed:', error.message)
    throw error
  }
}

async function query (text, params) {
  if (!pool) {
    throw new Error('Database not connected. Call connectDB() first.')
  }

  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result.rows
  } catch (error) {
    logger.error('Database query error:', error.message)
    throw error
  } finally {
    client.release()
  }
}

async function executeTransaction (asyncCallback) {
  if (!pool) {
    throw new Error('Database not connected. Call connectDB() first.')
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await asyncCallback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    logger.error('Transaction failed:', error.message)
    throw error
  } finally {
    client.release()
  }
}

async function close () {
  if (pool) {
    await pool.end()
    logger.info('Database connection closed')
  }
}

module.exports = {
  connectDB,
  query,
  executeTransaction,
  close
}
