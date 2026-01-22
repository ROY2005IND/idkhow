const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const API_TIMEOUT = Number.parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10)

export const API_CONFIG = {
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  endpoints: {
    // Auth
    auth: {
      login: '/auth/login',
      verify: '/auth/verify',
      logout: '/auth/logout',
      getNonce: '/auth/nonce'
    },
    // Products
    products: {
      list: '/products',
      create: '/products',
      getById: '/products/:id',
      getByManufacturer: '/products/manufacturer/:address',
      search: '/products/search',
      stats: '/products/stats'
    },
    // Events
    events: {
      list: '/events',
      create: '/events',
      getByProduct: '/events/product/:productId',
      getById: '/events/:id'
    },
    // Verification
    verify: {
      product: '/verify/product/:productId',
      qrCode: '/verify/qr',
      search: '/verify/search',
      stats: '/verify/stats'
    },
    // Dashboard
    dashboard: {
      stats: '/dashboard/stats',
      recentProducts: '/dashboard/recent-products',
      recentEvents: '/dashboard/recent-events'
    },
    // Analytics
    analytics: {
      productsByStatus: '/analytics/products-by-status',
      productsByCategory: '/analytics/products-by-category',
      eventsByType: '/analytics/events-by-type',
      productsOverTime: '/analytics/products-over-time'
    }
  }
}

export const buildEndpoint = (endpoint: string, params?: Record<string, string | number>): string => {
  let url = `${API_CONFIG.baseURL}${endpoint}`
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value))
    })
  }
  return url
}
