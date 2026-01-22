export enum ErrorCode {
  // Wallet & Web3 Errors (1000-1999)
  WALLET_NOT_INSTALLED = 1000,
  WALLET_NOT_CONNECTED = 1001,
  WALLET_CONNECTION_FAILED = 1002,
  WALLET_WRONG_NETWORK = 1003,
  USER_REJECTED_TRANSACTION = 1004,
  INSUFFICIENT_FUNDS = 1005,
  TRANSACTION_FAILED = 1006,
  GAS_ESTIMATION_FAILED = 1007,
  WALLET_LOCKED = 1008,
  CONTRACT_NOT_DEPLOYED = 1009,

  // Network Errors (2000-2999)
  NETWORK_ERROR = 2000,
  API_TIMEOUT = 2001,
  API_ERROR = 2002,
  OFFLINE = 2003,
  RPC_ERROR = 2004,

  // API Errors (3000-3999)
  UNAUTHORIZED = 3001,
  FORBIDDEN = 3002,
  NOT_FOUND = 3003,
  CONFLICT = 3004,
  VALIDATION_ERROR = 3005,
  SERVER_ERROR = 3006,
  RATE_LIMIT_EXCEEDED = 3007,

  // Validation Errors (4000-4999)
  INVALID_INPUT = 4001,
  INVALID_FORMAT = 4002,
  INVALID_ADDRESS = 4003,
  INVALID_QR_CODE = 4004,
  INVALID_PRODUCT_ID = 4005,
  INVALID_BATCH_NUMBER = 4006,

  // Application Errors (5000-5999)
  PRODUCT_NOT_FOUND = 5001,
  PRODUCT_ALREADY_EXISTS = 5002,
  EVENT_NOT_FOUND = 5003,
  VERIFICATION_FAILED = 5004,
  ROLE_NOT_ASSIGNED = 5005,
  INSUFFICIENT_PERMISSIONS = 5006,

  // Unknown Error
  UNKNOWN_ERROR = 9999
}

export const getErrorCodeInfo = (code: ErrorCode): { category: string; severity: 'low' | 'medium' | 'high' | 'critical' } => {
  const codeNumber = Number(code)

  if (codeNumber >= 1000 && codeNumber < 2000) {
    return { category: 'Wallet & Web3', severity: codeNumber < 1005 ? 'medium' : 'high' }
  } else if (codeNumber >= 2000 && codeNumber < 3000) {
    return { category: 'Network', severity: codeNumber === 2003 ? 'high' : 'medium' }
  } else if (codeNumber >= 3000 && codeNumber < 4000) {
    return { category: 'API', severity: codeNumber > 3005 ? 'high' : 'medium' }
  } else if (codeNumber >= 4000 && codeNumber < 5000) {
    return { category: 'Validation', severity: 'low' }
  } else if (codeNumber >= 5000 && codeNumber < 6000) {
    return { category: 'Application', severity: 'medium' }
  }

  return { category: 'Unknown', severity: 'critical' }
}

export const isRetryable = (code: ErrorCode): boolean => {
  const retryableCodes = [
    ErrorCode.WALLET_CONNECTION_FAILED,
    ErrorCode.USER_REJECTED_TRANSACTION,
    ErrorCode.TRANSACTION_FAILED,
    ErrorCode.GAS_ESTIMATION_FAILED,
    ErrorCode.NETWORK_ERROR,
    ErrorCode.API_TIMEOUT,
    ErrorCode.API_ERROR,
    ErrorCode.RPC_ERROR,
    ErrorCode.INVALID_QR_CODE,
    ErrorCode.VERIFICATION_FAILED
  ]

  return retryableCodes.includes(code)
}
