import { NetworkConfig } from '@types/blockchain.types'

export const NETWORKS: Record<number, NetworkConfig> = {
  80001: {
    chainId: 80001,
    chainName: 'Polygon Mumbai Testnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com']
  },
  137: {
    chainId: 137,
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com']
  },
  1: {
    chainId: 1,
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://eth.llamarpc.com'],
    blockExplorerUrls: ['https://etherscan.io']
  },
  11155111: {
    chainId: 11155111,
    chainName: 'Sepolia Testnet',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://rpc.sepolia.org'],
    blockExplorerUrls: ['https://sepolia.etherscan.io']
  }
}

export const TARGET_CHAIN_ID = Number.parseInt(import.meta.env.VITE_CHAIN_ID || '80001', 10)

export const TARGET_NETWORK = NETWORKS[TARGET_CHAIN_ID]

export const getNetworkConfig = (chainId: number): NetworkConfig | null => {
  return NETWORKS[chainId] || null
}

export const isCorrectNetwork = (chainId: number): boolean => {
  return chainId === TARGET_CHAIN_ID
}

export const switchToTargetNetwork = async (): Promise<void> => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed')
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${TARGET_CHAIN_ID.toString(16)}` }]
    })
  } catch (error: any) {
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [TARGET_NETWORK]
      })
    } else {
      throw error
    }
  }
}
