import Web3 from 'web3'
import { CONTRACTS, isContractsConfigured } from '@config/contracts'
import { ProductContract, SupplyChainEvent } from '@types/blockchain.types'
import { errorService, handleError } from './errorService'
import { logService } from './logService'
import { ErrorType } from '@types/error.types'
import { logger } from '@utils/logger'

class Web3Service {
  private web3: Web3 | null = null

  constructor() {
    this.initialize()
  }

  private initialize(): void {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      this.web3 = new Web3((window as any).ethereum)
    }
  }

  private getContract(name: keyof typeof CONTRACTS): any {
    if (!this.web3) {
      throw new Error('Web3 not initialized')
    }

    const contractConfig = CONTRACTS[name]
    if (!contractConfig.address) {
      throw new Error(`Contract ${name} not deployed`)
    }

    return new this.web3.eth.Contract(contractConfig.abi, contractConfig.address)
  }

  async getProduct(productId: number): Promise<ProductContract | null> {
    try {
      if (!isContractsConfigured()) {
        throw new Error('Contracts not configured')
      }

      const contract = this.getContract('PRODUCT_REGISTRY')
      const product = await contract.methods.getProduct(productId).call()

      return {
        productId: Number(product.productId),
        name: product.name,
        manufacturer: product.manufacturer,
        createdAt: Number(product.createdAt),
        batchNumber: product.batchNumber,
        exists: product.exists,
        description: product.description,
        category: product.category
      }
    } catch (error) {
      handleError(error, `get product ${productId}`)
      return null
    }
  }

  async getProductHistory(productId: number): Promise<SupplyChainEvent[]> {
    try {
      if (!isContractsConfigured()) {
        throw new Error('Contracts not configured')
      }

      const contract = this.getContract('SUPPLY_CHAIN_EVENTS')
      const events = await contract.methods.getProductHistory(productId).call()

      return events.map((event: any) => ({
        eventId: Number(event.eventId),
        productId: Number(event.productId),
        eventType: event.eventType,
        location: event.location,
        latitude: Number(event.latitude),
        longitude: Number(event.longitude),
        timestamp: Number(event.timestamp),
        actor: event.actor,
        notes: event.notes
      }))
    } catch (error) {
      handleError(error, `get product history ${productId}`)
      return []
    }
  }

  async registerProduct(
    name: string,
    batchNumber: string,
    description: string,
    category: string,
    fromAddress: string
  ): Promise<{ productId: number; txHash: string }> {
    try {
      if (!isContractsConfigured()) {
        throw new Error('Contracts not configured')
      }

      const contract = this.getContract('PRODUCT_REGISTRY')
      const method = contract.methods.registerProduct(name, batchNumber, description, category)

      // Estimate gas
      const gasEstimate = await method.estimateGas({ from: fromAddress })

      // Send transaction
      const result = await method.send({
        from: fromAddress,
        gas: Math.floor(gasEstimate * 1.2)
      })

      logService.logTransaction(result.transactionHash, fromAddress, contract._address, {
        method: 'registerProduct',
        productId: result.events.ProductRegistered?.returnValues?.productId
      })

      return {
        productId: result.events.ProductRegistered?.returnValues?.productId || 0,
        txHash: result.transactionHash
      }
    } catch (error: any) {
      handleError(error, 'register product')
      throw error
    }
  }

  async addSupplyChainEvent(
    productId: number,
    eventType: string,
    location: string,
    latitude: number,
    longitude: number,
    notes: string,
    fromAddress: string
  ): Promise<{ eventId: number; txHash: string }> {
    try {
      if (!isContractsConfigured()) {
        throw new Error('Contracts not configured')
      }

      const contract = this.getContract('SUPPLY_CHAIN_EVENTS')
      const method = contract.methods.addSupplyChainEvent(
        productId,
        eventType,
        location,
        latitude,
        longitude,
        notes
      )

      // Estimate gas
      const gasEstimate = await method.estimateGas({ from: fromAddress })

      // Send transaction
      const result = await method.send({
        from: fromAddress,
        gas: Math.floor(gasEstimate * 1.2)
      })

      logService.logTransaction(result.transactionHash, fromAddress, contract._address, {
        method: 'addSupplyChainEvent',
        productId,
        eventType
      })

      return {
        eventId: result.events.SupplyChainEventAdded?.returnValues?.eventId || 0,
        txHash: result.transactionHash
      }
    } catch (error) {
      handleError(error, 'add supply chain event')
      throw error
    }
  }

  async getTotalProducts(): Promise<number> {
    try {
      if (!isContractsConfigured()) {
        return 0
      }

      const contract = this.getContract('PRODUCT_REGISTRY')
      const total = await contract.methods.getTotalProducts().call()
      return Number(total)
    } catch (error) {
      handleError(error, 'get total products')
      return 0
    }
  }

  async getTotalEvents(): Promise<number> {
    try {
      if (!isContractsConfigured()) {
        return 0
      }

      const contract = this.getContract('SUPPLY_CHAIN_EVENTS')
      const total = await contract.methods.getTotalEvents().call()
      return Number(total)
    } catch (error) {
      handleError(error, 'get total events')
      return 0
    }
  }

  async getProductsByManufacturer(manufacturerAddress: string): Promise<number[]> {
    try {
      if (!isContractsConfigured()) {
        return []
      }

      const contract = this.getContract('PRODUCT_REGISTRY')
      const products = await contract.methods.getProductsByManufacturer(manufacturerAddress).call()
      return products.map((id: any) => Number(id))
    } catch (error) {
      handleError(error, 'get products by manufacturer')
      return []
    }
  }

  async productExists(productId: number): Promise<boolean> {
    try {
      if (!isContractsConfigured()) {
        return false
      }

      const contract = this.getContract('PRODUCT_REGISTRY')
      const exists = await contract.methods.productExists(productId).call()
      return exists
    } catch (error) {
      handleError(error, `check product exists ${productId}`)
      return false
    }
  }

  async getRole(address: string): Promise<string> {
    try {
      if (!isContractsConfigured()) {
        return '0'
      }

      const contract = this.getContract('ACCESS_CONTROL')
      const role = await contract.methods.getRole(address).call()
      return String(role)
    } catch (error) {
      handleError(error, 'get role')
      return '0'
    }
  }

  isReady(): boolean {
    return isContractsConfigured() && this.web3 !== null
  }

  getWeb3(): Web3 | null {
    return this.web3
  }
}

export const web3Service = new Web3Service()
