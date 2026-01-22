export interface NetworkConfig {
  chainId: number
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls: string[]
}

export interface WalletState {
  isConnected: boolean
  address: string | null
  balance: string
  chainId: number | null
  network: string | null
  isCorrectNetwork: boolean
  role: string | null
}

export interface ProductContract {
  productId: number
  name: string
  manufacturer: string
  createdAt: number
  batchNumber: string
  exists: boolean
  description: string
  category: string
}

export interface SupplyChainEvent {
  eventId: number
  productId: number
  eventType: string
  location: string
  latitude: number
  longitude: number
  timestamp: number
  actor: string
  notes: string
}

export enum BlockchainRole {
  NONE = '0',
  ADMIN = '1',
  MANUFACTURER = '2',
  DISTRIBUTOR = '3',
  RETAILER = '4',
  CUSTOMER = '5'
}

export interface TransactionResponse {
  hash: string
  from: string
  to?: string
  value?: string
  gasUsed?: string
  blockNumber?: number
  status?: number
}

export interface ContractEventLog {
  address: string
  blockNumber: number
  transactionHash: string
  event: string
  args: any[]
}
