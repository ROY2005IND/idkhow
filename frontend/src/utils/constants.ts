// Application Constants
export const APP_NAME = 'VeriChain Supply'
export const APP_VERSION = '1.0.0'

// Storage Keys
export const STORAGE_KEYS = {
  WALLET_ADDRESS: 'verichain_wallet_address',
  JWT_TOKEN: 'verichain_jwt_token',
  USER_ROLE: 'verichain_user_role',
  CONNECTED_NETWORK: 'verichain_connected_network',
  THEME: 'verichain_theme',
  LANGUAGE: 'verichain_language'
}

// Event Types
export const EVENT_TYPES = {
  MANUFACTURING: 'Manufacturing',
  WAREHOUSE: 'Warehouse',
  SHIPPING: 'Shipping',
  RETAIL: 'Retail',
  CUSTOMER: 'Customer'
} as const

// Product Categories
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Pharmaceuticals',
  'Food & Beverage',
  'Automotive',
  'Textiles',
  'Cosmetics',
  'Machinery',
  'Chemicals',
  'Other'
]

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MANUFACTURER: 'MANUFACTURER',
  DISTRIBUTOR: 'DISTRIBUTOR',
  RETAILER: 'RETAILER',
  CUSTOMER: 'CUSTOMER'
} as const

// Transaction Status
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  REJECTED: 'rejected'
}

// Time Constants
export const TIME_CONSTANTS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000
}

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
  ISO_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss"
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
}

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000
}

// Toast Duration
export const TOAST_DURATION = {
  SHORT: 3000,
  NORMAL: 5000,
  LONG: 10000
}

// File Upload Limits
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}

// QR Code Settings
export const QR_CODE = {
  SIZE: 200,
  LEVEL: 'M' as const,
  INCLUDE_MARGIN: true
}

// Gas Estimation
export const GAS = {
  DEFAULT_GAS_PRICE: '20000000000', // 20 Gwei
  GAS_LIMIT_MULTIPLIER: 1.2
}

// Chart Colors
export const CHART_COLORS = {
  primary: '#0ea5e9',
  secondary: '#a855f7',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  palette: [
    '#0ea5e9',
    '#a855f7',
    '#22c55e',
    '#f59e0b',
    '#ef4444',
    '#ec4899',
    '#14b8a6',
    '#f97316'
  ]
}

// Local Storage Keys for Error Logging
export const ERROR_STORAGE = {
  ERRORS: 'verichain_errors',
  MAX_ERRORS: 50
}

// MetaMask Install URL
export const METAMASK_INSTALL_URL = 'https://metamask.io/download/'

// Mumbai Faucet URL
export const MUMBAI_FAUCET_URL = 'https://faucet.polygon.technology/'
