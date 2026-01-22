import { useCallback, useEffect, useState } from 'react'
import { errorService, AppError } from '@services/errorService'
import { ErrorSeverity } from '@types/error.types'

export function useErrorHandler() {
  const [errors, setErrors] = useState<AppError[]>(errorService.getErrors())
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [currentError, setCurrentError] = useState<AppError | null>(null)

  useEffect(() => {
    // Refresh errors periodically
    const interval = setInterval(() => {
      setErrors(errorService.getErrors())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleAndLogError = useCallback((error: unknown, context?: string, details?: Record<string, any>): AppError => {
    const appError = errorService.log(error, context, details)
    setErrors(errorService.getErrors())

    // Show modal for high severity errors
    if (appError.severity === ErrorSeverity.HIGH || appError.severity === ErrorSeverity.CRITICAL) {
      setCurrentError(appError)
      setShowErrorModal(true)
    }

    return appError
  }, [])

  const getUserMessage = useCallback((error: AppError): string => {
    return errorService.getUserMessage(error)
  }, [])

  const dismissError = useCallback((): void => {
    setShowErrorModal(false)
    setCurrentError(null)
  }, [])

  const clearErrors = useCallback((): void => {
    errorService.clearErrors()
    setErrors([])
    setCurrentError(null)
    setShowErrorModal(false)
  }, [])

  const clearOldErrors = useCallback((maxAge?: number): void => {
    errorService.clearOldErrors(maxAge)
    setErrors(errorService.getErrors())
  }, [])

  const getRecentErrors = useCallback((severity?: ErrorSeverity): AppError[] => {
    return errorService.getErrors(severity).slice(-10).reverse()
  }, [])

  const getErrorById = useCallback((id: string): AppError | undefined => {
    return errorService.getErrorById(id)
  }, [])

  return {
    errors,
    currentError,
    showErrorModal,
    handleAndLogError,
    getUserMessage,
    dismissError,
    clearErrors,
    clearOldErrors,
    getRecentErrors,
    getErrorById,
    setShowErrorModal,
    setCurrentError
  }
}
