export enum ErrorType {
  // Wallet & Web3 Errors
  WALLET_NOT_INSTALLED = 'WALLET_NOT_INSTALLED',
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  WALLET_CONNECTION_FAILED = 'WALLET_CONNECTION_FAILED',
  WALLET_WRONG_NETWORK = 'WALLET_WRONG_NETWORK',
  USER_REJECTED_TRANSACTION = 'USER_REJECTED_TRANSACTION',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  GAS_ESTIMATION_FAILED = 'GAS_ESTIMATION_FAILED',

  // Network Errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_TIMEOUT = 'API_TIMEOUT',
  API_ERROR = 'API_ERROR',
  OFFLINE = 'OFFLINE',

  // API Errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',

  // Validation Errors
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_FORMAT = 'INVALID_FORMAT',
  INVALID_ADDRESS = 'INVALID_ADDRESS',
  INVALID_QR_CODE = 'INVALID_QR_CODE',

  // Application Errors
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  PRODUCT_ALREADY_EXISTS = 'PRODUCT_ALREADY_EXISTS',
  EVENT_NOT_FOUND = 'EVENT_NOT_FOUND',
  VERIFICATION_FAILED = 'VERIFICATION_FAILED',

  // Unknown Error Fallback
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface AppError {
  id: string
  type: ErrorType
  message: string
  userMessage: string
  severity: ErrorSeverity
  timestamp: number
  stack?: string
  details?: Record<string, any>
  retryable?: boolean
}

export interface ErrorResponse {
  success: false
  error: string
  message: string
  details?: Record<string, any>
  timestamp: string
}

// Additional exports for React components
export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

