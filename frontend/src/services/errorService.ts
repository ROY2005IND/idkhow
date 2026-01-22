import { ErrorType, ErrorSeverity, AppError } from '@types/error.types'
import { logger } from '@utils/logger'
import { getErrorMessage, getUserFriendlyMessage } from '@utils/errorMessages'
import { ERROR_STORAGE } from '@utils/constants'
import axios, { AxiosError } from 'axios'

class ErrorService {
  private errors: AppError[] = []
  private maxErrors = ERROR_STORAGE.MAX_ERRORS

  private generateId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(ERROR_STORAGE.ERRORS)
      if (stored) {
        this.errors = JSON.parse(stored)
      }
    } catch (error) {
      logger.warn('Failed to load errors from storage', error)
    }
  }

  private saveToStorage(): void {
    try {
      // Keep only the most recent errors
      const recentErrors = this.errors.slice(-this.maxErrors)
      localStorage.setItem(ERROR_STORAGE.ERRORS, JSON.stringify(recentErrors))
    } catch (error) {
      logger.warn('Failed to save errors to storage', error)
    }
  }

  private determineErrorType(error: unknown): ErrorType {
    // Check for Axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status) {
        const status = axiosError.response.status
        if (status === 401) return ErrorType.UNAUTHORIZED
        if (status === 403) return ErrorType.FORBIDDEN
        if (status === 404) return ErrorType.NOT_FOUND
        if (status === 409) return ErrorType.CONFLICT
        if (status === 429) return ErrorType.API_ERROR
        if (status >= 500) return ErrorType.SERVER_ERROR
      }
      if (axiosError.code === 'ECONNABORTED') return ErrorType.API_TIMEOUT
      return ErrorType.NETWORK_ERROR
    }

    // Check for Web3/MetaMask errors
    if (error instanceof Error) {
      const message = error.message.toLowerCase()

      if (message.includes('metamask') && message.includes('not found')) {
        return ErrorType.WALLET_NOT_INSTALLED
      }
      if (message.includes('user rejected')) {
        return ErrorType.USER_REJECTED_TRANSACTION
      }
      if (message.includes('insufficient funds')) {
        return ErrorType.INSUFFICIENT_FUNDS
      }
      if (message.includes('network') || message.includes('rpc')) {
        return ErrorType.NETWORK_ERROR
      }
    }

    return ErrorType.UNKNOWN_ERROR
  }

  private determineSeverity(errorType: ErrorType): ErrorSeverity {
    const severityMap: Partial<Record<ErrorType, ErrorSeverity>> = {
      [ErrorType.WALLET_NOT_INSTALLED]: ErrorSeverity.HIGH,
      [ErrorType.WALLET_CONNECTION_FAILED]: ErrorSeverity.HIGH,
      [ErrorType.INSUFFICIENT_FUNDS]: ErrorSeverity.HIGH,
      [ErrorType.TRANSACTION_FAILED]: ErrorSeverity.HIGH,
      [ErrorType.SERVER_ERROR]: ErrorSeverity.HIGH,
      [ErrorType.OFFLINE]: ErrorSeverity.HIGH,
      [ErrorType.FORBIDDEN]: ErrorSeverity.HIGH,
      [ErrorType.USER_REJECTED_TRANSACTION]: ErrorSeverity.LOW,
      [ErrorType.VALIDATION_ERROR]: ErrorSeverity.LOW,
      [ErrorType.WALLET_WRONG_NETWORK]: ErrorSeverity.MEDIUM,
      [ErrorType.NETWORK_ERROR]: ErrorSeverity.MEDIUM,
      [ErrorType.API_TIMEOUT]: ErrorSeverity.MEDIUM,
      [ErrorType.PRODUCT_NOT_FOUND]: ErrorSeverity.MEDIUM
    }

    return severityMap[errorType] || ErrorSeverity.MEDIUM
  }

  createAppError(
    error: unknown,
    context?: string,
    additionalDetails?: Record<string, any>
  ): AppError {
    const errorType = this.determineErrorType(error)
    const severity = this.determineSeverity(errorType)
    const errorMessage = getErrorMessage(errorType, context)
    const userMessage = getUserFriendlyMessage(errorType)

    const appError: AppError = {
      id: this.generateId(),
      type: errorType,
      message: errorMessage,
      userMessage,
      severity,
      timestamp: Date.now(),
      details: additionalDetails,
      retryable: this.isRetryable(errorType)
    }

    // Add stack trace if available
    if (error instanceof Error) {
      appError.stack = error.stack
    }

    return appError
  }

  log(error: unknown, context?: string, details?: Record<string, any>): void {
    const appError = this.createAppError(error, context, details)

    // Store in memory
    this.errors.push(appError)

    // Persist to localStorage
    this.saveToStorage()

    // Log to console
    logger.error(`[${appError.type}] ${appError.message}`, {
      id: appError.id,
      severity: appError.severity,
      context,
      details,
      stack: appError.stack
    })

    // Send to backend for monitoring (if available)
    this.sendToBackend(appError).catch(err => {
      logger.warn('Failed to send error to backend', err)
    })

    return appError
  }

  async sendToBackend(error: AppError): Promise<void> {
    try {
      // Only send in production or if debug is enabled
      const isDev = import.meta.env.DEV
      if (!isDev || import.meta.env.VITE_ENABLE_DEBUG === 'true') {
        await axios.post('/api/logs/error', {
          errorId: error.id,
          type: error.type,
          message: error.message,
          severity: error.severity,
          timestamp: new Date(error.timestamp).toISOString(),
          stack: error.stack,
          details: error.details
        })
      }
    } catch {
      // Silent fail - don't create infinite error loop
    }
  }

  getErrors(severity?: ErrorSeverity): AppError[] {
    if (severity) {
      return this.errors.filter(e => e.severity === severity)
    }
    return this.errors
  }

  clearErrors(): void {
    this.errors = []
    localStorage.removeItem(ERROR_STORAGE.ERRORS)
  }

  clearOldErrors(maxAge = 24 * 60 * 60 * 1000): void {
    const now = Date.now()
    this.errors = this.errors.filter(e => now - e.timestamp < maxAge)
    this.saveToStorage()
  }

  isRetryable(errorType: ErrorType): boolean {
    const retryableErrors: ErrorType[] = [
      ErrorType.WALLET_CONNECTION_FAILED,
      ErrorType.USER_REJECTED_TRANSACTION,
      ErrorType.TRANSACTION_FAILED,
      ErrorType.GAS_ESTIMATION_FAILED,
      ErrorType.NETWORK_ERROR,
      ErrorType.API_TIMEOUT,
      ErrorType.API_ERROR,
      ErrorType.INVALID_QR_CODE,
      ErrorType.VERIFICATION_FAILED
    ]

    return retryableErrors.includes(errorType)
  }

  getUserMessage(error: AppError): string {
    return error.userMessage
  }

  getErrorById(id: string): AppError | undefined {
    return this.errors.find(e => e.id === id)
  }
}

export const errorService = new ErrorService()
errorService.loadFromStorage()

// Export error handler utility
export const handleError = (error: unknown, context?: string, details?: Record<string, any>): AppError => {
  return errorService.log(error, context, details)
}

// Export async error handler wrapper
export const withErrorHandling = async <T>(
  fn: () => Promise<T>,
  context?: string
): Promise<T> => {
  try {
    return await fn()
  } catch (error) {
    handleError(error, context)
    throw error
  }
}
