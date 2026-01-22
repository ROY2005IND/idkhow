import { sleep } from './logger'

export interface RetryOptions {
  maxAttempts?: number
  delay?: number
  backoffMultiplier?: number
  maxDelay?: number
  onRetry?: (attempt: number, error: Error) => void
  shouldRetry?: (error: Error) => boolean
}

export const defaultRetryOptions: Required<RetryOptions> = {
  maxAttempts: 3,
  delay: 1000,
  backoffMultiplier: 2,
  maxDelay: 10000,
  onRetry: () => {},
  shouldRetry: () => true
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...defaultRetryOptions, ...options }
  let lastError: Error | undefined
  let currentDelay = opts.delay

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Check if we should retry this error
      if (!opts.shouldRetry(lastError) || attempt === opts.maxAttempts) {
        throw lastError
      }

      // Call onRetry callback
      opts.onRetry(attempt, lastError)

      // Wait before retrying with exponential backoff
      await sleep(Math.min(currentDelay, opts.maxDelay))
      currentDelay *= opts.backoffMultiplier
    }
  }

  throw lastError
}

export const shouldRetryNetworkError = (error: Error): boolean => {
  const retryablePatterns = [
    /network/i,
    /timeout/i,
    /ECONNREFUSED/i,
    /ETIMEDOUT/i,
    /fetch failed/i,
    /Failed to fetch/i,
    /5\d{2}/ // 5xx errors
  ]

  return retryablePatterns.some(pattern => pattern.test(error.message))
}

export const shouldRetryTransactionError = (error: Error): boolean => {
  const nonRetryablePatterns = [
    /user rejected/i,
    /insufficient funds/i,
    /nonce/i,
    /replacement transaction underpriced/i
  ]

  if (nonRetryablePatterns.some(pattern => pattern.test(error.message))) {
    return false
  }

  return true
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelay = 1000
): Promise<T> {
  return retry(fn, {
    maxAttempts,
    delay: baseDelay,
    backoffMultiplier: 2,
    maxDelay: 10000
  })
}
