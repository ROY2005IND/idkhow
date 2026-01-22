export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

class Logger {
  private level: LogLevel
  private isDevelopment: boolean

  constructor() {
    this.level = this.getLogLevel()
    this.isDevelopment = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEBUG === 'true'
  }

  private getLogLevel(): LogLevel {
    const envLevel = import.meta.env.VITE_LOG_LEVEL?.toUpperCase()
    switch (envLevel) {
      case 'DEBUG':
        return LogLevel.DEBUG
      case 'INFO':
        return LogLevel.INFO
      case 'WARN':
        return LogLevel.WARN
      case 'ERROR':
        return LogLevel.ERROR
      default:
        return this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO
    }
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString()
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : ''
    return `[${timestamp}] [${level}] ${message}${metaStr}`
  }

  private log(level: LogLevel, levelName: string, message: string, meta?: any): void {
    if (level < this.level) return

    const formattedMessage = this.formatMessage(levelName, message, meta)

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage)
        break
      case LogLevel.INFO:
        console.info(formattedMessage)
        break
      case LogLevel.WARN:
        console.warn(formattedMessage)
        break
      case LogLevel.ERROR:
        console.error(formattedMessage)
        break
    }
  }

  debug(message: string, meta?: any): void {
    this.log(LogLevel.DEBUG, 'DEBUG', message, meta)
  }

  info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, 'INFO', message, meta)
  }

  warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, 'WARN', message, meta)
  }

  error(message: string, meta?: any): void {
    this.log(LogLevel.ERROR, 'ERROR', message, meta)
  }

  // Specialized logging methods
  logTransaction(hash: string, from: string, to: string, value?: string): void {
    this.info('Transaction executed', { hash, from, to, value })
  }

  logError(error: Error, context?: string): void {
    this.error(`${context ? `${context}: ` : ''}${error.message}`, {
      name: error.name,
      stack: error.stack
    })
  }

  logWalletEvent(event: string, address?: string): void {
    this.info(`Wallet event: ${event}`, address ? { address } : undefined)
  }
}

export const logger = new Logger()
export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))
