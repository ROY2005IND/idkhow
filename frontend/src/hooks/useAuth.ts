import { useState, useEffect, useCallback } from 'react'
import { walletService } from '@services/walletService'
import { apiService } from '@services/apiService'
import { logService } from '@services/logService'
import { STORAGE_KEYS } from '@utils/constants'
import { User, UserRole } from '@types/api.types'
import { handleError } from '@services/errorService'
import { ErrorType } from '@types/error.types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem(STORAGE_KEYS.JWT_TOKEN)

      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      // Verify token with backend
      const response = await apiService.verifyToken(token)

      if (response.success && response.data) {
        setUser(response.data)

        // Update wallet service role
        if (response.data.role) {
          localStorage.setItem(STORAGE_KEYS.USER_ROLE, response.data.role)
        }
      } else {
        logout()
      }
    } catch (err) {
      handleError(err, 'check auth')
      logout()
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (walletAddress?: string): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      // Connect wallet if not connected
      if (!walletService.isConnected()) {
        walletAddress = await walletService.connect()
      }

      const address = walletAddress || walletService.getAddress()

      if (!address) {
        throw new Error('No wallet address')
      }

      // Generate sign message
      const message = `Sign this message to authenticate with VeriChain Supply\nTimestamp: ${Date.now()}`

      // Request signature
      const signature = await walletService.signMessage(message)

      // Send to backend
      const response = await apiService.login(address, signature, message)

      if (response.success && response.data) {
        const { token, user: userData } = response.data

        // Store token
        localStorage.setItem(STORAGE_KEYS.JWT_TOKEN, token)

        // Store user role
        if (userData.role) {
          localStorage.setItem(STORAGE_KEYS.USER_ROLE, userData.role)
        }

        setUser(userData)
        logService.logUserAction('user_login', { address })
      } else {
        throw new Error('Login failed')
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      handleError(error, 'login')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback((): void => {
    // Clear storage
    localStorage.removeItem(STORAGE_KEYS.JWT_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.WALLET_ADDRESS)
    localStorage.removeItem(STORAGE_KEYS.USER_ROLE)

    // Clear user state
    setUser(null)
    setError(null)

    // Disconnect wallet
    walletService.disconnect().catch(err => {
      handleError(err, 'logout')
    })

    logService.logUserAction('user_logout')
  }, [])

  const hasRole = useCallback(
    (requiredRoles: UserRole[]): boolean => {
      if (!user) return false
      return requiredRoles.includes(user.role as UserRole)
    },
    [user]
  )

  const isAuthenticated = (): boolean => {
    return !!user && !!localStorage.getItem(STORAGE_KEYS.JWT_TOKEN)
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth,
    hasRole,
    isAuthenticated: isAuthenticated()
  }
}
