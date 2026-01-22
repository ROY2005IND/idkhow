import axios from 'axios'
import { logger } from '@utils/logger'

export interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  context?: string
  userId?: string
  walletAddress?: string
  data?: Record<string, any>
}

class LogService {
  private logs: LogEntry[] = []
  private maxBufferSize = 100
  private flushInterval = 30000 // 30 seconds
  private flushTimer: ReturnType<typeof setInterval> | null = null

  constructor() {
    this.startFlushTimer()
  }

  private async flushLogs(): Promise<void> {
    if (this.logs.length === 0) return

    const logsToSend = [...this.logs]
    this.logs = []

    try {
      await axios.post('/api/logs/batch', { logs: logsToSend })
      logger.debug(`Successfully sent ${logsToSend.length} logs to backend`)
    } catch (error) {
      logger.warn('Failed to send logs to backend', error)
      // Re-add logs to buffer
      this.logs.unshift(...logsToSend)
    }
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flushLogs()
    }, this.flushInterval)
  }

  private addLog(entry: Omit<LogEntry, 'timestamp'>): void {
    const logEntry: LogEntry = {
      ...entry,
      timestamp: new Date().toISOString()
    }

    this.logs.push(logEntry)

    // Flush immediately if buffer is full
    if (this.logs.length >= this.maxBufferSize) {
      this.flushLogs()
    }
  }

  info(message: string, context?: string, data?: Record<string, any>): void {
    this.addLog({ level: 'info', message, context, data })
    logger.info(message, data)
  }

  warn(message: string, context?: string, data?: Record<string, any>): void {
    this.addLog({ level: 'warn', message, context, data })
    logger.warn(message, data)
  }

  error(message: string, context?: string, data?: Record<string, any>): void {
    this.addLog({ level: 'error', message, context, data })
    logger.error(message, data)
  }

  debug(message: string, context?: string, data?: Record<string, any>): void {
    this.addLog({ level: 'debug', message, context, data })
    logger.debug(message, data)
  }

  async logUserAction(action: string, data?: Record<string, any>): Promise<void> {
    this.info(`User action: ${action}`, 'user_action', data)
  }

  async logTransaction(hash: string, from: string, to: string, data?: Record<string, any>): Promise<void> {
    this.info(`Transaction: ${hash}`, 'transaction', { hash, from, to, ...data })
  }

  async logError(error: Error, context?: string): Promise<void> {
    this.error(error.message, context, {
      name: error.name,
      stack: error.stack
    })
  }

  async flush(): Promise<void> {
    await this.flushLogs()
  }

  clear(): void {
    this.logs = []
  }

  stop(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = null
    }
    this.flush()
  }
}

export const logService = new LogService()

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    logService.flush()
  })
}
