import { useEffect, useState, useCallback } from 'react'
import { walletService } from '@services/walletService'
import { WalletState } from '@types/blockchain.types'

export function useWallet() {
  const [state, setState] = useState<WalletState>(walletService.getState())

  useEffect(() => {
    const unsubscribe = walletService.subscribe((newState) => {
      setState(newState)
    })

    return unsubscribe
  }, [])

  const connect = useCallback(async () => {
    return walletService.connect()
  }, [])

  const disconnect = useCallback(async () => {
    return walletService.disconnect()
  }, [])

  const signMessage = useCallback(async (message: string) => {
    return walletService.signMessage(message)
  }, [])

  const refreshBalance = useCallback(async () => {
    return walletService.refreshBalance()
  }, [])

  const switchNetwork = useCallback(async () => {
    return walletService.switchNetwork()
  }, [])

  const isInstalled = useCallback(async () => {
    return walletService.isMetaMaskInstalled()
  }, [])

  return {
    ...state,
    connect,
    disconnect,
    signMessage,
    refreshBalance,
    switchNetwork,
    isInstalled,
    web3: walletService.getWeb3()
  }
}
