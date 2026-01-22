const logger = require('../utils/logger')

function validateEnv () {
  const requiredEnvVars = [
    'JWT_SECRET',
    'WEB3_PROVIDER_URL',
    'PRODUCT_REGISTRY_ADDRESS',
    'SUPPLY_CHAIN_EVENTS_ADDRESS',
    'ACCESS_CONTROL_ADDRESS'
  ]

  const missingVars = []

  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName)
    }
  })

  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}`
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  // Validate database configuration
  if (!process.env.DATABASE_URL && (!process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_USER)) {
    const errorMessage = 'Database configuration missing. Provide DATABASE_URL or DB_HOST, DB_NAME, and DB_USER'
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  // Validate blockchain configuration
  if (!process.env.WEB3_PROVIDER_URL) {
    const errorMessage = 'Blockchain provider URL (WEB3_PROVIDER_URL) is required'
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  // Validate contract addresses
  const contractAddresses = [
    process.env.PRODUCT_REGISTRY_ADDRESS,
    process.env.SUPPLY_CHAIN_EVENTS_ADDRESS,
    process.env.ACCESS_CONTROL_ADDRESS
  ]

  contractAddresses.forEach((address, index) => {
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      const contractNames = ['PRODUCT_REGISTRY_ADDRESS', 'SUPPLY_CHAIN_EVENTS_ADDRESS', 'ACCESS_CONTROL_ADDRESS']
      const errorMessage = `Invalid contract address for ${contractNames[index]}`
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }
  })

  return true
}

function getEnvConfig () {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT) || 5000,
    databaseUrl: process.env.DATABASE_URL,
    dbHost: process.env.DB_HOST,
    dbPort: parseInt(process.env.DB_PORT) || 5432,
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '7d',
    jwtCookieExpire: parseInt(process.env.JWT_COOKIE_EXPIRE) || 7,
    web3ProviderUrl: process.env.WEB3_PROVIDER_URL,
    privateKeyForTransactions: process.env.PRIVATE_KEY_FOR_TRANSACTIONS,
    productRegistryAddress: process.env.PRODUCT_REGISTRY_ADDRESS,
    supplyChainEventsAddress: process.env.SUPPLY_CHAIN_EVENTS_ADDRESS,
    accessControlAddress: process.env.ACCESS_CONTROL_ADDRESS,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    logLevel: process.env.LOG_LEVEL || 'info',
    logFilePath: process.env.LOG_FILE_PATH || './logs/app.log',
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    apiVersion: process.env.API_VERSION || 'v1'
  }
}

module.exports = {
  validateEnv,
  getEnvConfig
}
