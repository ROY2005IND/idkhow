import { ErrorType, ErrorSeverity } from '@types/error.types'

export const ERROR_MESSAGES: Record<ErrorType, { title: string; message: string; userMessage: string; severity: ErrorSeverity; retryable: boolean }> = {
  // Wallet & Web3 Errors
  [ErrorType.WALLET_NOT_INSTALLED]: {
    title: 'Wallet Not Installed',
    message: 'MetaMask or another Web3 wallet is not installed',
    userMessage: 'Please install MetaMask to use this application. Visit metamask.io to download.',
    severity: ErrorSeverity.HIGH,
    retryable: false
  },
  [ErrorType.WALLET_NOT_CONNECTED]: {
    title: 'Wallet Not Connected',
    message: 'No wallet is connected',
    userMessage: 'Please connect your wallet to continue.',
    severity: ErrorSeverity.MEDIUM,
    retryable: true
  },
  [ErrorType.WALLET_CONNECTION_FAILED]: {
    title: 'Connection Failed',
    message: 'Failed to connect wallet',
    userMessage: 'Unable to connect to your wallet. Please try again.',
    severity: ErrorSeverity.HIGH,
    retryable: true
  },
  [ErrorType.WALLET_WRONG_NETWORK]: {
    title: 'Wrong Network',
    message: 'Connected to wrong network',
    userMessage: 'Please switch to Polygon Mumbai Testnet to use this application.',
    severity: ErrorSeverity.MEDIUM,
    retryable: false
  },
  [ErrorType.USER_REJECTED_TRANSACTION]: {
    title: 'Transaction Rejected',
    message: 'User rejected the transaction',
    userMessage: 'You cancelled the transaction. Please try again if you wish to proceed.',
    severity: ErrorSeverity.LOW,
    retryable: true
  },
  [ErrorType.INSUFFICIENT_FUNDS]: {
    title: 'Insufficient Funds',
    message: 'Not enough funds to complete transaction',
    userMessage: 'You do not have enough MATIC to complete this transaction. Please add more funds.',
    severity: ErrorSeverity.HIGH,
    retryable: false
  },
  [ErrorType.TRANSACTION_FAILED]: {
    title: 'Transaction Failed',
    message: 'Blockchain transaction failed',
    userMessage: 'The transaction failed on the blockchain. Please check the details and try again.',
    severity: ErrorSeverity.HIGH,
    retryable: true
  },
  [ErrorType.GAS_ESTIMATION_FAILED]: {
    title: 'Gas Estimation Failed',
    message: 'Unable to estimate gas for transaction',
    userMessage: 'Could not estimate transaction gas. The transaction may fail. Try again later.',
    severity: ErrorSeverity.MEDIUM,
    retryable: true
  },

  // Network Errors
  [ErrorType.NETWORK_ERROR]: {
    title: 'Network Error',
    message: 'Network connection issue',
    userMessage: 'Unable to connect to the server. Please check your internet connection.',
    severity: ErrorSeverity.MEDIUM,
    retryable: true
  },
  [ErrorType.API_TIMEOUT]: {
    title: 'Request Timeout',
    message: 'API request timed out',
    userMessage: 'The request took too long to complete. Please try again.',
    severity: ErrorSeverity.MEDIUM,
    retryable: true
  },
  [ErrorType.API_ERROR]: {
    title: 'API Error',
    message: 'API request failed',
    userMessage: 'An error occurred while communicating with the server.',
    severity: ErrorSeverity.MEDIUM,
    retryable: true
  },
  [ErrorType.OFFLINE]: {
    title: 'Offline Mode',
    message: 'No internet connection',
    userMessage: 'You appear to be offline. Please check your connection.',
    severity: ErrorSeverity.HIGH,
    retryable: true
  },

  // API Errors
  [ErrorType.UNAUTHORIZED]: {
    title: 'Unauthorized',
    message: 'Authentication required',
    userMessage: 'Please connect your wallet and sign in to access this feature.',
    severity: ErrorSeverity.MEDIUM,
    retryable: false
  },
  [ErrorType.FORBIDDEN]: {
    title: 'Access Denied',
    message: 'Insufficient permissions',
    userMessage: 'You do not have permission to perform this action.',
    severity: ErrorSeverity.HIGH,
    retryable: false
  },
  [ErrorType.NOT_FOUND]: {
    title: 'Not Found',
    message: 'Resource not found',
    userMessage: 'The requested resource was not found. It may have been deleted or moved.',
    severity: ErrorSeverity.MEDIUM,
    retryable: false
  },
  [ErrorType.CONFLICT]: {
    title: 'Conflict',
    message: 'Resource conflict',
    userMessage: 'This resource already exists or there is a conflict with the current state.',
    severity: ErrorSeverity.MEDIUM,
    retryable: false
  },
  [ErrorType.VALIDATION_ERROR]: {
    title: 'Validation Error',
    message: 'Invalid input data',
    userMessage: 'Please check your input and correct any errors.',
    severity: ErrorSeverity.LOW,
    retryable: false
  },
  [ErrorType.SERVER_ERROR]: {
    title: 'Server Error',
    message: 'Internal server error',
    userMessage: 'An error occurred on the server. Please try again later.',
    severity: ErrorSeverity.HIGH,
    retryable: true
  },

  // Validation Errors
  [ErrorType.INVALID_INPUT]: {
    title: 'Invalid Input',
    message: 'Input validation failed',
    userMessage: 'Please provide valid input data.',
    severity: ErrorSeverity.LOW,
    retryable: false
  },
  [ErrorType.INVALID_FORMAT]: {
    title: 'Invalid Format',
    message: 'Data format is incorrect',
    userMessage: 'The provided data is in an incorrect format.',
    severity: ErrorSeverity.LOW,
    retryable: false
  },
  [ErrorType.INVALID_ADDRESS]: {
    title: 'Invalid Address',
    message: 'Invalid Ethereum address',
    userMessage: 'Please provide a valid Ethereum address.',
    severity: ErrorSeverity.LOW,
    retryable: false
  },
  [ErrorType.INVALID_QR_CODE]: {
    title: 'Invalid QR Code',
    message: 'QR code is invalid or corrupted',
    userMessage: 'Unable to read the QR code. Please try again with a valid code.',
    severity: ErrorSeverity.LOW,
    retryable: true
  },

  // Application Errors
  [ErrorType.PRODUCT_NOT_FOUND]: {
    title: 'Product Not Found',
    message: 'Product does not exist',
    userMessage: 'The requested product was not found in the system.',
    severity: ErrorSeverity.MEDIUM,
    retryable: false
  },
  [ErrorType.PRODUCT_ALREADY_EXISTS]: {
    title: 'Product Exists',
    message: 'Product already registered',
    userMessage: 'This product has already been registered in the system.',
    severity: ErrorSeverity.MEDIUM,
    retryable: false
  },
  [ErrorType.EVENT_NOT_FOUND]: {
    title: 'Event Not Found',
    message: 'Supply chain event not found',
    userMessage: 'The requested event was not found.',
    severity: ErrorSeverity.MEDIUM,
    retryable: false
  },
  [ErrorType.VERIFICATION_FAILED]: {
    title: 'Verification Failed',
    message: 'Product verification failed',
    userMessage: 'Unable to verify this product. Please check the product details.',
    severity: ErrorSeverity.MEDIUM,
    retryable: true
  },

  // Unknown Error
  [ErrorType.UNKNOWN_ERROR]: {
    title: 'Unknown Error',
    message: 'An unexpected error occurred',
    userMessage: 'Something went wrong. Please try again or contact support if the issue persists.',
    severity: ErrorSeverity.HIGH,
    retryable: true
  }
}

export const getErrorMessage = (errorType: ErrorType): typeof ERROR_MESSAGES[ErrorType] => {
  return ERROR_MESSAGES[errorType] || ERROR_MESSAGES[ErrorType.UNKNOWN_ERROR]
}

export const ERROR_CODES: Record<number, ErrorType> = {
  400: ErrorType.VALIDATION_ERROR,
  401: ErrorType.UNAUTHORIZED,
  403: ErrorType.FORBIDDEN,
  404: ErrorType.NOT_FOUND,
  409: ErrorType.CONFLICT,
  429: ErrorType.API_ERROR,
  500: ErrorType.SERVER_ERROR,
  502: ErrorType.NETWORK_ERROR,
  503: ErrorType.API_TIMEOUT,
  504: ErrorType.API_TIMEOUT
}

export const getErrorTypeFromStatusCode = (statusCode: number): ErrorType => {
  return ERROR_CODES[statusCode] || ErrorType.UNKNOWN_ERROR
}
