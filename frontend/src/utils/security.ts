// Security utilities for input sanitization and XSS prevention

export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return ''

  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .trim()
}

export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
  const sanitized: Record<string, any> = {}

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      if (typeof value === 'string') {
        sanitized[key] = sanitizeInput(value)
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObject(value)
      } else {
        sanitized[key] = value
      }
    }
  }

  return sanitized as T
}

export const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }

  return text.replace(/[&<>"']/g, m => map[m])
}

export const isSafeUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    const allowedProtocols = ['http:', 'https:']
    return allowedProtocols.includes(parsed.protocol)
  } catch {
    return false
  }
}

export const truncateAddress = (address: string, length = 6): string => {
  if (!address || typeof address !== 'string') return ''
  if (address.length <= length * 2) return address

  return `${address.substring(0, length)}...${address.substring(address.length - length)}`
}

export const formatBalance = (balance: string | number, decimals = 4): string => {
  const num = typeof balance === 'string' ? parseFloat(balance) : balance

  if (isNaN(num)) return '0'

  return num.toFixed(decimals)
}

export const isValidJSON = (jsonString: string): boolean => {
  try {
    JSON.parse(jsonString)
    return true
  } catch {
    return false
  }
}

export const preventXSS = (str: string): string => {
  // First escape HTML
  let escaped = escapeHtml(str)

  // Then remove any remaining potentially dangerous patterns
  escaped = escaped
    .replace(/eval\(/gi, '')
    .replace(/alert\(/gi, '')
    .replace(/document\./gi, '')
    .replace(/window\./gi, '')

  return escaped
}

export const generateNonce = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export const hashString = async (str: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
