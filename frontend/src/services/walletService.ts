import Web3 from 'web3'
import { WalletState, BlockchainRole } from '@types/blockchain.types'
import { errorService, handleError } from './errorService'
import { logService } from './logService'
import { STORAGE_KEYS } from '@utils/constants'
import { switchToTargetNetwork, isCorrectNetwork } from '@config/networks'
import { ErrorType } from '@types/error.types'
import { logger } from '@utils/logger'

class WalletService {
  private web3: Web3 | null = null
  private state: WalletState = {
    isConnected: false,
    address: null,
    balance: '0',
    chainId: null,
    network: null,
    isCorrectNetwork: false,
    role: null
  }
  private listeners: Set<(state: WalletState) => void> = new Set()

  constructor() {
    this.initialize()
  }

  private initialize(): void {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      this.web3 = new Web3((window as any).ethereum)
      this.checkConnection()
      this.setupEventListeners()
    }
  }

  private setupEventListeners(): void {
    if (!(window as any).ethereum) return

    const ethereum = (window as any).ethereum

    // Account changed
    ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length > 0) {
        this.connect(accounts[0])
      } else {
        this.disconnect()
      }
    })

    // Chain changed
    ethereum.on('chainChanged', (chainId: string) => {
      const chainIdNumber = parseInt(chainId, 16)
      this.state.chainId = chainIdNumber
      this.state.isCorrectNetwork = isCorrectNetwork(chainIdNumber)
      this.notifyListeners()
      window.location.reload()
    })

    // Disconnect
    ethereum.on('disconnect', () => {
      this.disconnect()
    })
  }

  private checkConnection(): void {
    const storedAddress = localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS)
    if (storedAddress && (window as any).ethereum) {
      (window as any).ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.includes(storedAddress)) {
            this.connect(storedAddress)
          } else {
            this.disconnect()
          }
        })
        .catch(() => {
          this.disconnect()
        })
    }
  }

  async connect(address?: string): Promise<string> {
    try {
      // Check if MetaMask is installed
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        throw new Error(ErrorType.WALLET_NOT_INSTALLED)
      }

      let accountAddress = address

      // Request account access if no address provided
      if (!accountAddress) {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts'
        })

        accountAddress = accounts[0]
      }

      // Initialize Web3 if needed
      if (!this.web3) {
        this.web3 = new Web3((window as any).ethereum)
      }

      // Get chain ID
      const chainId = await this.web3.eth.getChainId()
      const isCorrectNet = isCorrectNetwork(chainId)

      // Switch to correct network if needed
      if (!isCorrectNet) {
        await switchToTargetNetwork()
      }

      // Get balance
      const balance = await this.web3.eth.getBalance(accountAddress)
      const balanceInEth = this.web3.utils.fromWei(balance, 'ether')

      // Update state
      this.state = {
        isConnected: true,
        address: accountAddress,
        balance: balanceInEth,
        chainId: chainId,
        network: this.getNetworkName(chainId),
        isCorrectNetwork: isCorrectNetwork(chainId),
        role: localStorage.getItem(STORAGE_KEYS.USER_ROLE)
      }

      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, accountAddress)

      // Log connection
      logService.logUserAction('wallet_connected', { address: accountAddress })
      logger.info('Wallet connected', { address: accountAddress, chainId })

      this.notifyListeners()

      return accountAddress
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error(ErrorType.USER_REJECTED_TRANSACTION)
      }
      handleError(error, 'connect wallet')
      throw error
    }
  }

  async disconnect(): Promise<void> {
    this.state = {
      isConnected: false,
      address: null,
      balance: '0',
      chainId: null,
      network: null,
      isCorrectNetwork: false,
      role: null
    }

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.WALLET_ADDRESS)
    localStorage.removeItem(STORAGE_KEYS.JWT_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_ROLE)

    logService.logUserAction('wallet_disconnected')
    logger.info('Wallet disconnected')

    this.notifyListeners()
  }

  async signMessage(message: string): Promise<string> {
    if (!this.state.isConnected || !this.state.address) {
      throw new Error(ErrorType.WALLET_NOT_CONNECTED)
    }

    try {
      const signature = await (window as any).ethereum.request({
        method: 'personal_sign',
        params: [message, this.state.address]
      })

      logService.logUserAction('message_signed', { message })
      return signature
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error(ErrorType.USER_REJECTED_TRANSACTION)
      }
      handleError(error, 'sign message')
      throw error
    }
  }

  async getBalance(): Promise<string> {
    if (!this.state.isConnected || !this.state.address || !this.web3) {
      return '0'
    }

    try {
      const balance = await this.web3.eth.getBalance(this.state.address)
      this.state.balance = this.web3.utils.fromWei(balance, 'ether')
      this.notifyListeners()
      return this.state.balance
    } catch (error) {
      handleError(error, 'get balance')
      return '0'
    }
  }

  async refreshBalance(): Promise<void> {
    await this.getBalance()
  }

  getState(): WalletState {
    return { ...this.state }
  }

  isConnected(): boolean {
    return this.state.isConnected
  }

  getAddress(): string | null {
    return this.state.address
  }

  getWeb3(): Web3 | null {
    return this.web3
  }

  subscribe(listener: (state: WalletState) => void): () => void {
    this.listeners.add(listener)
    listener(this.state)

    return () => {
      this.listeners.delete(listener)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      listener({ ...this.state })
    })
  }

  private getNetworkName(chainId: number): string {
    const networks: Record<number, string> = {
      1: 'Ethereum Mainnet',
      5: 'Goerli Testnet',
      11155111: 'Sepolia Testnet',
      137: 'Polygon Mainnet',
      80001: 'Polygon Mumbai Testnet',
      1337: 'Localhost'
    }
    return networks[chainId] || 'Unknown Network'
  }

  async isMetaMaskInstalled(): Promise<boolean> {
    if (typeof window === 'undefined') return false
    return !!(window as any).ethereum?.isMetaMask
  }

  async switchNetwork(): Promise<void> {
    await switchToTargetNetwork()
  }
}

export const walletService = new WalletService()
