import { useState, useEffect, useCallback } from 'react'
import { web3Service } from '@services/web3Service'
import { walletService } from '@services/walletService'
import { handleError } from '@services/errorService'
import { ErrorType } from '@types/error.types'

export function useWeb3() {
  const [isReady, setIsReady] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const checkReady = () => {
      const ready = web3Service.isReady()
      setIsReady(ready)

      if (!ready) {
        setError(new Error(ErrorType.TRANSACTION_FAILED))
      }
    }

    checkReady()

    // Listen for wallet connection changes
    const unsubscribe = walletService.subscribe((state) => {
      setIsReady(web3Service.isReady() && state.isConnected)
    })

    return unsubscribe
  }, [])

  const connect = useCallback(async () => {
    setIsConnecting(true)
    setError(null)

    try {
      await walletService.connect()
      setIsReady(web3Service.isReady())
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      handleError(error, 'useWeb3 connect')
      throw error
    } finally {
      setIsConnecting(false)
    }
  }, [])

  return {
    isReady,
    isConnecting,
    error,
    connect,
    service: web3Service
  }
}
