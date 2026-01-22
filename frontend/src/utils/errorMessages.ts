import { ErrorType } from '@types/error.types'

export const getErrorMessage = (errorType: ErrorType, context?: string): string => {
  const messages: Record<ErrorType, string> = {
    [ErrorType.WALLET_NOT_INSTALLED]: 'MetaMask wallet is not installed. Please install it to continue.',
    [ErrorType.WALLET_NOT_CONNECTED]: 'Please connect your wallet to continue.',
    [ErrorType.WALLET_CONNECTION_FAILED]: 'Failed to connect to wallet. Please try again.',
    [ErrorType.WALLET_WRONG_NETWORK]: 'Please switch to Polygon Mumbai Testnet.',
    [ErrorType.USER_REJECTED_TRANSACTION]: 'Transaction was rejected by user.',
    [ErrorType.INSUFFICIENT_FUNDS]: 'Insufficient funds to complete transaction.',
    [ErrorType.TRANSACTION_FAILED]: 'Transaction failed. Please try again.',
    [ErrorType.GAS_ESTIMATION_FAILED]: 'Failed to estimate gas costs.',
    [ErrorType.NETWORK_ERROR]: 'Network error occurred. Please check your connection.',
    [ErrorType.API_TIMEOUT]: 'Request timed out. Please try again.',
    [ErrorType.API_ERROR]: 'API error occurred.',
    [ErrorType.OFFLINE]: 'You are offline. Please check your internet connection.',
    [ErrorType.UNAUTHORIZED]: 'You are not authorized to perform this action.',
    [ErrorType.FORBIDDEN]: 'Access denied. You do not have permission.',
    [ErrorType.NOT_FOUND]: 'Resource not found.',
    [ErrorType.CONFLICT]: 'Resource conflict detected.',
    [ErrorType.VALIDATION_ERROR]: 'Invalid input provided.',
    [ErrorType.SERVER_ERROR]: 'Server error occurred. Please try again later.',
    [ErrorType.INVALID_INPUT]: 'Invalid input format.',
    [ErrorType.INVALID_FORMAT]: 'Data format is incorrect.',
    [ErrorType.INVALID_ADDRESS]: 'Invalid Ethereum address.',
    [ErrorType.INVALID_QR_CODE]: 'Invalid QR code format.',
    [ErrorType.PRODUCT_NOT_FOUND]: 'Product not found.',
    [ErrorType.PRODUCT_ALREADY_EXISTS]: 'Product already exists.',
    [ErrorType.EVENT_NOT_FOUND]: 'Event not found.',
    [ErrorType.VERIFICATION_FAILED]: 'Verification failed.',
    [ErrorType.UNKNOWN_ERROR]: 'An unknown error occurred.'
  }

  const baseMessage = messages[errorType] || messages[ErrorType.UNKNOWN_ERROR]
  return context ? `${baseMessage} Context: ${context}` : baseMessage
}

export const getUserFriendlyMessage = (errorType: ErrorType): string => {
  const friendlyMessages: Partial<Record<ErrorType, string>> = {
    [ErrorType.WALLET_NOT_INSTALLED]: '🦊 MetaMask is required. Click here to install it.',
    [ErrorType.WALLET_WRONG_NETWORK]: '🌐 Please switch to Polygon Mumbai Testnet',
    [ErrorType.INSUFFICIENT_FUNDS]: '💰 You need more MATIC to complete this transaction',
    [ErrorType.USER_REJECTED_TRANSACTION]: '❌ You cancelled the transaction',
    [ErrorType.TRANSACTION_FAILED]: '⚠️ Transaction failed on the blockchain',
    [ErrorType.NETWORK_ERROR]: '🔌 Network connection lost. Please check your internet',
    [ErrorType.PRODUCT_NOT_FOUND]: '🔍 Product not found in the system',
    [ErrorType.VERIFICATION_FAILED]: '🚫 Unable to verify this product'
  }

  return friendlyMessages[errorType] || getErrorMessage(errorType)
}
