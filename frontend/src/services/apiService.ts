import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { errorService, handleError } from './errorService'
import { logService } from './logService'
import { STORAGE_KEYS } from '@utils/constants'
import { retry, shouldRetryNetworkError } from '@utils/retry'
import { ErrorType } from '@types/error.types'
import { logger } from '@utils/logger'

class ApiService {
  private client: AxiosInstance
  private baseURL: string
  private timeout: number

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    this.timeout = Number.parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10)

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add JWT token if available
        const token = localStorage.getItem(STORAGE_KEYS.JWT_TOKEN)
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId()

        logService.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`, undefined, {
          headers: config.headers
        })

        return config
      },
      (error: AxiosError) => {
        handleError(error, 'API Request Interceptor')
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        logService.debug(`API Response: ${response.status} ${response.config.url}`, undefined, {
          data: response.data
        })
        return response
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        // Handle 401 Unauthorized - token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            // Clear expired token
            localStorage.removeItem(STORAGE_KEYS.JWT_TOKEN)
            localStorage.removeItem(STORAGE_KEYS.WALLET_ADDRESS)
            localStorage.removeItem(STORAGE_KEYS.USER_ROLE)

            // Trigger re-authentication
            window.dispatchEvent(new Event('token-expired'))

            return Promise.reject(error)
          } catch (refreshError) {
            return Promise.reject(refreshError)
          }
        }

        // Log error
        logService.error(`API Error: ${error.message}`, undefined, {
          url: originalRequest?.url,
          status: error.response?.status,
          data: error.response?.data
        })

        return Promise.reject(error)
      }
    )
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }

  private async requestWithRetry<T>(
    fn: () => Promise<T>,
    context?: string
  ): Promise<T> {
    const maxRetries = Number.parseInt(import.meta.env.VITE_MAX_RETRIES || '3', 10)

    return retry(
      fn,
      {
        maxAttempts: maxRetries + 1,
        delay: 1000,
        backoffMultiplier: 2,
        maxDelay: 10000,
        shouldRetry: (error: Error) => shouldRetryNetworkError(error),
        onRetry: (attempt, error) => {
          logger.warn(`Retry attempt ${attempt} for ${context || 'request'}`, error.message)
        }
      }
    )
  }

  async get<T>(url: string, config?: any): Promise<T> {
    return this.requestWithRetry(
      () => this.client.get<T>(url, config).then(res => res.data),
      `GET ${url}`
    )
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.requestWithRetry(
      () => this.client.post<T>(url, data, config).then(res => res.data),
      `POST ${url}`
    )
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.requestWithRetry(
      () => this.client.put<T>(url, data, config).then(res => res.data),
      `PUT ${url}`
    )
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.requestWithRetry(
      () => this.client.patch<T>(url, data, config).then(res => res.data),
      `PATCH ${url}`
    )
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    return this.requestWithRetry(
      () => this.client.delete<T>(url, config).then(res => res.data),
      `DELETE ${url}`
    )
  }

  // Auth methods
  async login(walletAddress: string, signature: string, message: string) {
    return this.post('/auth/login', { walletAddress, signature, message })
  }

  async verifyToken(token: string) {
    return this.get('/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  // Dashboard methods
  async getDashboardStats() {
    return this.get('/dashboard/stats')
  }

  async getRecentProducts(limit = 10) {
    return this.get('/dashboard/recent-products', { params: { limit } })
  }

  async getRecentEvents(limit = 10) {
    return this.get('/dashboard/recent-events', { params: { limit } })
  }

  // Product methods
  async getProducts(params?: any) {
    return this.get('/products', { params })
  }

  async getProductById(productId: number) {
    return this.get(`/products/${productId}`)
  }

  async createProduct(data: any) {
    return this.post('/products', data)
  }

  // Event methods
  async getEvents(params?: any) {
    return this.get('/events', { params })
  }

  async getEventsByProduct(productId: number) {
    return this.get(`/events/product/${productId}`)
  }

  async createEvent(data: any) {
    return this.post('/events', data)
  }

  // Verification methods
  async verifyProduct(productId: number) {
    return this.get(`/verify/product/${productId}`)
  }

  async searchProducts(query: string) {
    return this.get('/verify/search', { params: { query } })
  }

  // Analytics methods
  async getAnalyticsData() {
    return this.get('/analytics/products-by-status')
  }
}

export const apiService = new ApiService()
