import AccessControlABI from '../../backend/contracts/AccessControl.json'
import ProductRegistryABI from '../../backend/contracts/ProductRegistry.json'
import SupplyChainEventsABI from '../../backend/contracts/SupplyChainEvents.json'

export const CONTRACTS = {
  ACCESS_CONTROL: {
    address: import.meta.env.VITE_ACCESS_CONTROL_ADDRESS || '',
    abi: AccessControlABI.abi,
    name: 'AccessControl'
  },
  PRODUCT_REGISTRY: {
    address: import.meta.env.VITE_PRODUCT_REGISTRY_ADDRESS || '',
    abi: ProductRegistryABI.abi,
    name: 'ProductRegistry'
  },
  SUPPLY_CHAIN_EVENTS: {
    address: import.meta.env.VITE_SUPPLY_CHAIN_EVENTS_ADDRESS || '',
    abi: SupplyChainEventsABI.abi,
    name: 'SupplyChainEvents'
  }
}

export const isContractsConfigured = (): boolean => {
  return !!(
    CONTRACTS.ACCESS_CONTROL.address &&
    CONTRACTS.PRODUCT_REGISTRY.address &&
    CONTRACTS.SUPPLY_CHAIN_EVENTS.address
  )
}

export const getContractAddress = (contractName: keyof typeof CONTRACTS): string => {
  return CONTRACTS[contractName].address
}

export const getContractABI = (contractName: keyof typeof CONTRACTS): any[] => {
  return CONTRACTS[contractName].abi
}
