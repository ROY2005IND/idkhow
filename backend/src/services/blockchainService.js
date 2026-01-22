const logger = require('../utils/logger')
const {
  getWeb3,
  getProductRegistryContract,
  getSupplyChainEventsContract,
  getAccessControlContract,
  getTransactionSender
} = require('../config/blockchain')

class BlockchainService {
  constructor () {
    this.web3 = null
    this.productRegistry = null
    this.supplyChainEvents = null
    this.accessControl = null
  }

  async init () {
    this.web3 = getWeb3()
    this.productRegistry = getProductRegistryContract()
    this.supplyChainEvents = getSupplyChainEventsContract()
    this.accessControl = getAccessControlContract()
  }

  async registerProductOnChain (productData) {
    if (!this.web3 || !this.productRegistry) {
      await this.init()
    }

    try {
      const account = getTransactionSender()
      const { name, batchNumber, description, category } = productData

      logger.info('Registering product on blockchain:', { name, batchNumber })

      const tx = await this.productRegistry.methods
        .registerProduct(name, batchNumber, description, category)
        .send({
          from: account.address,
          gas: 3000000,
          gasPrice: await this.web3.eth.getGasPrice()
        })

      const productId = tx.events.ProductCreated.returnValues.productId

      logger.info('Product registered on blockchain:', {
        productId,
        txHash: tx.transactionHash
      })

      return {
        productId: parseInt(productId),
        txHash: tx.transactionHash,
        blockNumber: tx.blockNumber
      }
    } catch (error) {
      logger.error('Failed to register product on blockchain:', error.message)
      throw new Error(`Blockchain registration failed: ${error.message}`)
    }
  }

  async addSupplyChainEventOnChain (eventData) {
    if (!this.web3 || !this.supplyChainEvents) {
      await this.init()
    }

    try {
      const account = getTransactionSender()
      const {
        productId,
        eventType,
        location,
        latitude = 0,
        longitude = 0,
        notes = ''
      } = eventData

      logger.info('Adding supply chain event on blockchain:', {
        productId,
        eventType
      })

      const tx = await this.supplyChainEvents.methods
        .addSupplyChainEvent(
          productId,
          eventType,
          location,
          latitude,
          longitude,
          notes
        )
        .send({
          from: account.address,
          gas: 3000000,
          gasPrice: await this.web3.eth.getGasPrice()
        })

      logger.info('Supply chain event added on blockchain:', {
        productId,
        eventType,
        txHash: tx.transactionHash
      })

      return {
        txHash: tx.transactionHash,
        blockNumber: tx.blockNumber
      }
    } catch (error) {
      logger.error('Failed to add event on blockchain:', error.message)
      throw new Error(`Blockchain event logging failed: ${error.message}`)
    }
  }

  async getProductFromChain (productId) {
    if (!this.web3 || !this.productRegistry) {
      await this.init()
    }

    try {
      logger.info('Fetching product from blockchain:', { productId })

      const product = await this.productRegistry.methods
        .getProduct(productId)
        .call()

      return {
        productId: parseInt(product.productId),
        name: product.name,
        manufacturer: product.manufacturer,
        createdAt: parseInt(product.createdAt),
        batchNumber: product.batchNumber,
        exists: product.exists,
        description: product.description,
        category: product.category
      }
    } catch (error) {
      logger.error('Failed to get product from blockchain:', error.message)
      throw new Error(`Blockchain read failed: ${error.message}`)
    }
  }

  async getProductHistoryFromChain (productId) {
    if (!this.web3 || !this.supplyChainEvents) {
      await this.init()
    }

    try {
      logger.info('Fetching product history from blockchain:', { productId })

      const events = await this.supplyChainEvents.methods
        .getProductHistory(productId)
        .call()

      return events.map(event => ({
        eventId: parseInt(event.eventId),
        eventType: event.eventType,
        location: event.location,
        latitude: parseInt(event.latitude),
        longitude: parseInt(event.longitude),
        timestamp: parseInt(event.timestamp),
        actor: event.actor,
        notes: event.notes
      }))
    } catch (error) {
      logger.error('Failed to get product history from blockchain:', error.message)
      throw new Error(`Blockchain history read failed: ${error.message}`)
    }
  }

  async verifyUserRoleOnChain (walletAddress, requiredRole) {
    if (!this.web3 || !this.accessControl) {
      await this.init()
    }

    try {
      logger.info('Verifying user role on blockchain:', {
        walletAddress,
        requiredRole
      })

      const userRole = await this.accessControl.methods
        .getRole(walletAddress)
        .call()

      // Role mapping: 0=Admin, 1=Manufacturer, 2=Distributor, 3=Retailer, 4=Customer
      const roleMap = {
        Admin: 0,
        Manufacturer: 1,
        Distributor: 2,
        Retailer: 3,
        Customer: 4
      }

      const requiredRoleValue = roleMap[requiredRole]
      const hasPermission = parseInt(userRole) <= requiredRoleValue

      return {
        hasPermission,
        userRole: parseInt(userRole),
        requiredRole: requiredRoleValue
      }
    } catch (error) {
      logger.error('Failed to verify user role on blockchain:', error.message)
      throw new Error(`Role verification failed: ${error.message}`)
    }
  }

  async getTransactionStatus (txHash) {
    if (!this.web3) {
      await this.init()
    }

    try {
      const receipt = await this.web3.eth.getTransactionReceipt(txHash)

      if (!receipt) {
        return {
          status: 'pending',
          confirmations: 0
        }
      }

      return {
        status: receipt.status ? 'confirmed' : 'failed',
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed,
        confirmations:
          receipt.blockNumber ?
            (await this.web3.eth.getBlockNumber()) - receipt.blockNumber : 0
      }
    } catch (error) {
      logger.error('Failed to get transaction status:', error.message)
      throw error
    }
  }
}

module.exports = new BlockchainService()
