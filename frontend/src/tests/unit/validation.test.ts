import { describe, it, expect } from 'vitest'
import { productRegistrationSchema, productIdSchema, ethereumAddressSchema } from '@utils/validators'

describe('Validators', () => {
  describe('Product Registration Schema', () => {
    it('should validate valid product data', () => {
      const validData = {
        name: 'Test Product',
        batchNumber: 'BATCH-001',
        description: 'A test product description',
        category: 'Electronics'
      }

      expect(() => productRegistrationSchema.parse(validData)).not.toThrow()
    })

    it('should reject product name that is too short', () => {
      const invalidData = {
        name: 'AB',
        batchNumber: 'BATCH-001',
        description: 'A test product description',
        category: 'Electronics'
      }

      expect(() => productRegistrationSchema.parse(invalidData)).toThrow()
    })

    it('should reject invalid batch number format', () => {
      const invalidData = {
        name: 'Test Product',
        batchNumber: 'INVALID@BATCH',
        description: 'A test product description',
        category: 'Electronics'
      }

      expect(() => productRegistrationSchema.parse(invalidData)).toThrow()
    })
  })

  describe('Product ID Schema', () => {
    it('should accept valid product ID', () => {
      const validData = { productId: '123' }
      expect(() => productIdSchema.parse(validData)).not.toThrow()
    })

    it('should reject negative product ID', () => {
      const invalidData = { productId: '-1' }
      expect(() => productIdSchema.parse(invalidData)).toThrow()
    })

    it('should reject non-numeric product ID', () => {
      const invalidData = { productId: 'abc' }
      expect(() => productIdSchema.parse(invalidData)).toThrow()
    })
  })

  describe('Ethereum Address Schema', () => {
    it('should accept valid Ethereum address', () => {
      const validAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f8B9d'
      expect(() => ethereumAddressSchema.parse(validAddress)).not.toThrow()
    })

    it('should reject invalid Ethereum address', () => {
      const invalidAddress = '0xinvalid'
      expect(() => ethereumAddressSchema.parse(invalidAddress)).toThrow()
    })

    it('should reject address without 0x prefix', () => {
      const invalidAddress = '742d35Cc6634C0532925a3b844Bc9e7595f8B9d'
      expect(() => ethereumAddressSchema.parse(invalidAddress)).toThrow()
    })
  })
})
