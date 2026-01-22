export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

// Auth Types
export interface AuthRequest {
  walletAddress: string
  signature: string
  message: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface User {
  walletAddress: string
  email?: string
  username?: string
  role: UserRole
  createdAt: string
  updatedAt?: string
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANUFACTURER = 'MANUFACTURER',
  DISTRIBUTOR = 'DISTRIBUTOR',
  RETAILER = 'RETAILER',
  CUSTOMER = 'CUSTOMER'
}

// Dashboard Types
export interface DashboardStats {
  totalProducts: number
  totalEvents: number
  verifiedProducts: number
  pendingVerifications: number
  totalUsers: number
}

export interface RecentProduct {
  productId: number
  name: string
  category: string
  manufacturer: string
  createdAt: string
}

export interface RecentEvent {
  eventId: number
  productId: number
  productName: string
  eventType: string
  location: string
  timestamp: string
  actor: string
}

// Analytics Types
export interface AnalyticsData {
  productsByStatus: Array<{
    status: string
    count: number
  }>
  productsByCategory: Array<{
    category: string
    count: number
  }>
  eventsByType: Array<{
    eventType: string
    count: number
  }>
  productsOverTime: Array<{
    date: string
    count: number
  }>
}
