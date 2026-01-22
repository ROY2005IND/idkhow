import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAsync } from '@hooks/useAsync'
import { web3Service } from '@services/web3Service'
import { apiService } from '@services/apiService'
import { ProductContract, SupplyChainEvent } from '@types/blockchain.types'
import { ProductHistory, VerificationStatus } from '@types/product.types'
import { truncateAddress, formatBalance } from '@utils/security'
import { format } from 'date-fns'
import AnimatedCard from '@components/AnimatedCard'
import LoadingState from '@components/Common/LoadingState'
import { showSuccess, showError } from '@components/Common/Notifications'

export default function TrackProduct() {
  const navigate = useNavigate()
  const [productId, setProductId] = useState<string>('')
  const [searched, setSearched] = useState(false)

  const { data: product, loading: productLoading, execute: searchProduct } = useAsync(
    async () => {
      const id = Number.parseInt(productId, 10)
      if (isNaN(id) || id <= 0) {
        throw new Error('Invalid product ID')
      }
      return web3Service.getProduct(id)
    },
    { immediate: false }
  )

  const { data: events, loading: eventsLoading } = useAsync(
    async () => {
      const id = Number.parseInt(productId, 10)
      if (isNaN(id) || id <= 0) return []
      return web3Service.getProductHistory(id)
    },
    { immediate: false }
  )

  const { data: verification } = useAsync(
    async () => {
      const id = Number.parseInt(productId, 10)
      if (isNaN(id) || id <= 0) return null
      return apiService.verifyProduct(id)
    },
    { immediate: false }
  )

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    const id = Number.parseInt(productId, 10)
    if (isNaN(id) || id <= 0) {
      showError('Please enter a valid product ID')
      return
    }

    setSearched(true)
    await searchProduct()
  }

  const getEventTypeIcon = (eventType: string) => {
    const icons: Record<string, string> = {
      'Manufacturing': '🏭',
      'Warehouse': '📦',
      'Shipping': '🚚',
      'Retail': '🏪',
      'Customer': '👤'
    }
    return icons[eventType] || '📍'
  }

  const getVerificationColor = (status: VerificationStatus) => {
    switch (status) {
      case 'AUTHENTIC':
        return 'bg-success-600/20 text-success-400 border-success-600/50'
      case 'SUSPICIOUS':
        return 'bg-warning-600/20 text-warning-400 border-warning-600/50'
      case 'FAKE':
        return 'bg-error-600/20 text-error-400 border-error-600/50'
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-600/50'
    }
  }

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Track Product</h1>
        <p className="text-gray-400">
          Trace the complete supply chain journey of any product
        </p>
      </motion.div>

      {/* Search */}
      <AnimatedCard className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter Product ID (e.g., 1, 2, 3...)"
            className="flex-1 px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          />
          <motion.button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Track
          </motion.button>
        </form>
      </AnimatedCard>

      {/* Product Info */}
      {searched && (
        <>
          {productLoading || eventsLoading ? (
            <div className="text-center py-12">
              <LoadingState text="Loading product data..." />
            </div>
          ) : !product || !product?.exists ? (
            <AnimatedCard className="text-center py-12">
              <p className="text-gray-400 text-lg">Product not found</p>
              <p className="text-gray-500 mt-2">
                Please check the product ID and try again
              </p>
            </AnimatedCard>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Product Details */}
              <AnimatedCard>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
                    <p className="text-gray-400">Product ID: #{product.productId}</p>
                  </div>

                  {verification && (
                    <div className={`px-4 py-2 rounded-lg border ${getVerificationColor(verification.status)}`}>
                      <p className="font-bold">{verification.status}</p>
                      {verification.confidenceScore && (
                        <p className="text-sm">Confidence: {verification.confidenceScore}%</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Manufacturer</p>
                    <p className="text-white font-mono">{truncateAddress(product.manufacturer)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Batch Number</p>
                    <p className="text-white">{product.batchNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Category</p>
                    <p className="text-white">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Created</p>
                    <p className="text-white">
                      {format(new Date(product.createdAt * 1000), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1">
                    <p className="text-gray-400 text-sm mb-1">Total Events</p>
                    <p className="text-white text-2xl font-bold">{events?.length || 0}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-dark-800">
                  <p className="text-gray-400 text-sm mb-2">Description</p>
                  <p className="text-gray-300">{product.description}</p>
                </div>
              </AnimatedCard>

              {/* Supply Chain Timeline */}
              <AnimatedCard>
                <h3 className="text-xl font-bold text-white mb-6">Supply Chain Journey</h3>

                {events && events.length > 0 ? (
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-dark-700" />

                    {events.map((event, index) => (
                      <motion.div
                        key={event.eventId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative pl-16 pb-8 last:pb-0"
                      >
                        {/* Timeline Dot */}
                        <motion.div
                          className="absolute left-4 w-5 h-5 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-xs"
                          whileHover={{ scale: 1.2 }}
                        >
                          {getEventTypeIcon(event.eventType)}
                        </motion.div>

                        {/* Event Card */}
                        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 hover:border-primary-500/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-white font-medium">{event.eventType}</p>
                              <p className="text-gray-400 text-sm">{event.location}</p>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {format(new Date(event.timestamp * 1000), 'MMM dd, HH:mm')}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
                            <div>
                              <p className="text-gray-500">Actor</p>
                              <p className="text-gray-300 font-mono text-xs">
                                {truncateAddress(event.actor)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Coordinates</p>
                              <p className="text-gray-300">
                                {event.latitude}, {event.longitude}
                              </p>
                            </div>
                          </div>

                          {event.notes && (
                            <p className="mt-3 text-sm text-gray-400 bg-dark-900/50 p-2 rounded">
                              {event.notes}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-8">
                    No supply chain events recorded yet
                  </p>
                )}
              </AnimatedCard>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
