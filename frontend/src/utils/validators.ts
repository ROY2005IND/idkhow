import { z } from 'zod'

// Ethereum address validation
export const ethereumAddressSchema = z
  .string()
  .min(1, 'Address is required')
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address format')

// Product validation schemas
export const productRegistrationSchema = z.object({
  name: z
    .string()
    .min(3, 'Product name must be at least 3 characters')
    .max(100, 'Product name must not exceed 100 characters'),
  batchNumber: z
    .string()
    .min(1, 'Batch number is required')
    .max(50, 'Batch number must not exceed 50 characters')
    .regex(/^[A-Za-z0-9\-_]+$/, 'Batch number can only contain letters, numbers, hyphens, and underscores'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must not exceed 50 characters'),
  manufacturingDate: z.string().optional(),
  price: z.number().positive('Price must be a positive number').optional()
})

// Product ID validation
export const productIdSchema = z.object({
  productId: z
    .string()
    .regex(/^\d+$/, 'Product ID must be a number')
    .transform(val => Number.parseInt(val, 10))
    .refine(val => val > 0, 'Product ID must be greater than 0')
})

// Event validation schema
export const eventSchema = z.object({
  productId: z.number().positive('Product ID must be positive'),
  eventType: z.enum(['Manufacturing', 'Warehouse', 'Shipping', 'Retail', 'Customer']),
  location: z.string().min(1, 'Location is required').max(200, 'Location too long'),
  latitude: z.number().min(-90).max(90, 'Latitude must be between -90 and 90'),
  longitude: z.number().min(-180).max(180, 'Longitude must be between -180 and 180'),
  notes: z.string().max(500, 'Notes too long').optional()
})

// Search validation schema
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Query too long'),
  category: z.string().optional()
})

// QR code validation schema
export const qrCodeSchema = z.object({
  productId: z.number().positive('Product ID must be positive'),
  productName: z.string().min(1, 'Product name is required'),
  batchNumber: z.string().min(1, 'Batch number is required'),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  createdAt: z.string().datetime('Invalid date format')
})

// Email validation schema
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(5, 'Email too short')
  .max(100, 'Email too long')

// Username validation schema
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must not exceed 30 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores')

// Validation helpers
export const validateEthereumAddress = (address: string): boolean => {
  try {
    ethereumAddressSchema.parse(address)
    return true
  } catch {
    return false
  }
}

export const validateProductId = (productId: string | number): boolean => {
  try {
    productIdSchema.parse({ productId: String(productId) })
    return true
  } catch {
    return false
  }
}

export const validateBatchNumber = (batchNumber: string): boolean => {
  const batchSchema = productRegistrationSchema.shape.batchNumber
  try {
    batchSchema.parse(batchNumber)
    return true
  } catch {
    return false
  }
}

// Export types from schemas
export type ProductRegistrationData = z.infer<typeof productRegistrationSchema>
export type ProductIdData = z.infer<typeof productIdSchema>
export type EventData = z.infer<typeof eventSchema>
export type SearchData = z.infer<typeof searchSchema>
export type QRCodeData = z.infer<typeof qrCodeData>
