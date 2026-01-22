export interface Product {
  productId: number
  name: string
  manufacturer: string
  manufacturerReference?: string
  createdAt: Date | string
  batchNumber: string
  description: string
  category: string
  qrCode?: string
  status: ProductStatus
  totalEvents: number
}

export enum ProductStatus {
  MANUFACTURED = 'Manufactured',
  IN_WAREHOUSE = 'In Warehouse',
  IN_TRANSIT = 'In Transit',
  AT_RETAILER = 'At Retailer',
  SOLD = 'Sold',
  VERIFIED = 'Verified',
  FLAGGED = 'Flagged'
}

export interface ProductRegistrationData {
  name: string
  batchNumber: string
  description: string
  category: string
  manufacturingDate?: Date | string
  price?: number
  image?: File | string
}

export interface ProductHistory {
  product: Product
  events: SupplyChainEvent[]
  verificationStatus: VerificationStatus
  confidenceScore?: number
}

export interface SupplyChainEvent {
  eventId: number
  productId: number
  eventType: string
  location: string
  latitude: number
  longitude: number
  timestamp: Date | string
  actor: string
  actorRole: string
  notes?: string
}

export enum VerificationStatus {
  AUTHENTIC = 'AUTHENTIC',
  SUSPICIOUS = 'SUSPICIOUS',
  FAKE = 'FAKE',
  PENDING = 'PENDING',
  UNKNOWN = 'UNKNOWN'
}

export interface VerificationResult {
  status: VerificationStatus
  confidenceScore: number
  message: string
  product?: Product
  history?: SupplyChainEvent[]
  verificationCount: number
  lastVerified?: Date | string
}

export interface QRCodeData {
  productId: number
  productName: string
  batchNumber: string
  manufacturer: string
  createdAt: string
}
