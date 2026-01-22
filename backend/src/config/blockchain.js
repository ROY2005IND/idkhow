const Web3 = require('web3')
const logger = require('../utils/logger')

let web3 = null
let productRegistryContract = null
let supplyChainEventsContract = null
let accessControlContract = null

const PRODUCT_REGISTRY_ABI = require('../../contracts/ProductRegistry.json')
const SUPPLY_CHAIN_EVENTS_ABI = require('../../contracts/SupplyChainEvents.json')
const ACCESS_CONTROL_ABI = require('../../contracts/AccessControl.json')

async function initializeBlockchain () {
  try {
    if (!process.env.WEB3_PROVIDER_URL) {
      throw new Error('WEB3_PROVIDER_URL environment variable not set')
    }

    // Initialize Web3 instance
    web3 = new Web3(process.env.WEB3_PROVIDER_URL)
    logger.info('Connected to blockchain provider:', process.env.WEB3_PROVIDER_URL)

    // Verify connection by getting latest block
    const blockNumber = await web3.eth.getBlockNumber()
    logger.info('Latest block number:', blockNumber)

    // Initialize contracts if addresses are provided
    if (process.env.PRODUCT_REGISTRY_ADDRESS) {
      productRegistryContract = new web3.eth.Contract(
        PRODUCT_REGISTRY_ABI.abi,
        process.env.PRODUCT_REGISTRY_ADDRESS
      )
      logger.info('ProductRegistry contract initialized:', process.env.PRODUCT_REGISTRY_ADDRESS)
    }

    if (process.env.SUPPLY_CHAIN_EVENTS_ADDRESS) {
      supplyChainEventsContract = new web3.eth.Contract(
        SUPPLY_CHAIN_EVENTS_ABI.abi,
        process.env.SUPPLY_CHAIN_EVENTS_ADDRESS
      )
      logger.info('SupplyChainEvents contract initialized:', process.env.SUPPLY_CHAIN_EVENTS_ADDRESS)
    }

    if (process.env.ACCESS_CONTROL_ADDRESS) {
      accessControlContract = new web3.eth.Contract(
        ACCESS_CONTROL_ABI.abi,
        process.env.ACCESS_CONTROL_ADDRESS
      )
      logger.info('AccessControl contract initialized:', process.env.ACCESS_CONTROL_ADDRESS)
    }

    return web3
  } catch (error) {
    logger.error('Failed to initialize blockchain service:', error.message)
    throw error
  }
}

function getWeb3 () {
  if (!web3) {
    throw new Error('Web3 not initialized. Call initializeBlockchain() first.')
  }
  return web3
}

function getProductRegistryContract () {
  if (!productRegistryContract) {
    throw new Error('ProductRegistry contract not initialized')
  }
  return productRegistryContract
}

function getSupplyChainEventsContract () {
  if (!supplyChainEventsContract) {
    throw new Error('SupplyChainEvents contract not initialized')
  }
  return supplyChainEventsContract
}

function getAccessControlContract () {
  if (!accessControlContract) {
    throw new Error('AccessControl contract not initialized')
  }
  return accessControlContract
}

// Get configured contract addresses
function getContractAddresses () {
  return {
    productRegistry: process.env.PRODUCT_REGISTRY_ADDRESS,
    supplyChainEvents: process.env.SUPPLY_CHAIN_EVENTS_ADDRESS,
    accessControl: process.env.ACCESS_CONTROL_ADDRESS
  }
}

// Get transaction sender account from private key
function getTransactionSender () {
  if (!process.env.PRIVATE_KEY_FOR_TRANSACTIONS) {
    throw new Error('PRIVATE_KEY_FOR_TRANSACTIONS environment variable not set')
  }
  // Remove 0x prefix if present
  const privateKey = process.env.PRIVATE_KEY_FOR_TRANSACTIONS.replace(/^0x/, '');
  const account = web3.eth.accounts.privateKeyToAccount(privateKey)
  return account
}

module.exports = {
  initializeBlockchain,
  getWeb3,
  getProductRegistryContract,
  getSupplyChainEventsContract,
  getAccessControlContract,
  getContractAddresses,
  getTransactionSender
}
