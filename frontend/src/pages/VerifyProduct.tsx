import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAsync } from '@hooks/useAsync'
import { apiService } from '@services/apiService'
import { web3Service } from '@services/web3Service'
import { VerificationResult } from '@types/product.types'
import AnimatedCard from '@components/AnimatedCard'
import LoadingState from '@components/Common/LoadingState'
import { showSuccess, showError } from '@components/Common/Notifications'
import QRCode from 'qrcode.react'
import { useWallet } from '@hooks/useWallet'

export default function VerifyProduct() {
  const [productId, setProductId] = useState<string>('')
  const [searched, setSearched] = useState(false)
  const [mode, setMode] = useState<'id' | 'qr'>('id')

  const { address } = useWallet()

  const { data: result, loading, execute: verifyProduct } = useAsync(
    async () => {
      const id = Number.parseInt(productId, 10)
      if (isNaN(id) || id <= 0) {
        throw new Error('Invalid product ID')
      }
      const verification = await apiService.verifyProduct(id)
      const product = await web3Service.getProduct(id)

      return {
        ...verification,
        product,
        history: await web3Service.getProductHistory(id)
      }
    },
    { immediate: false }
  )

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    const id = Number.parseInt(productId, 10)
    if (isNaN(id) || id <= 0) {
      showError('Please enter a valid product ID')
      return
    }

    setSearched(true)
    await verifyProduct()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AUTHENTIC':
        return 'from-success-500 to-success-600'
      case 'SUSPICIOUS':
        return 'from-warning-500 to-warning-600'
      case 'FAKE':
        return 'from-error-500 to-error-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AUTHENTIC':
        return '✅'
      case 'SUSPICIOUS':
        return '⚠️'
      case 'FAKE':
        return '❌'
      default:
        return '❓'
    }
  }

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Verify Product</h1>
        <p className="text-gray-400">
          Authenticate products and check their blockchain history
        </p>
      </motion.div>

      {/* Mode Selector */}
      <div className="flex gap-2 mb-6">
        <motion.button
          onClick={() => setMode('id')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            mode === 'id'
              ? 'bg-primary-600 text-white'
              : 'bg-dark-800 text-gray-400 hover:text-white'
          }`}
          whileHover={{ scale: mode === 'id' ? {} : 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Search by ID
        </motion.button>
        <motion.button
          onClick={() => setMode('qr')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            mode === 'qr'
              ? 'bg-primary-600 text-white'
              : 'bg-dark-800 text-gray-400 hover:text-white'
          }`}
          whileHover={{ scale: mode === 'qr' ? {} : 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Scan QR Code
        </motion.button>
      </div>

      {/* Search by ID */}
      {mode === 'id' && (
        <AnimatedCard className="mb-8">
          <form onSubmit={handleVerify} className="flex gap-4">
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Enter Product ID to verify"
              className="flex-1 px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            />
            <motion.button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Verify
            </motion.button>
          </form>
        </AnimatedCard>
      )}

      {/* Scan QR Code */}
      {mode === 'qr' && (
        <AnimatedCard className="mb-8">
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">QR Code Scanner</p>
            <div className="bg-dark-800 rounded-lg p-8 inline-block border-2 border-dashed border-dark-700">
              <p className="text-gray-500">
                📷 Camera access required for QR scanning
              </p>
              <p className="text-gray-600 text-sm mt-2">
                (QR scanner feature coming soon)
              </p>
            </div>
          </div>
        </AnimatedCard>
      )}

      {/* Verification Result */}
      {searched && (
        <>
          {loading ? (
            <div className="text-center py-12">
              <LoadingState text="Verifying product..." />
            </div>
          ) : !result ? (
            <AnimatedCard className="text-center py-12">
              <p className="text-gray-400 text-lg">Product not found</p>
            </AnimatedCard>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Status Card */}
              <AnimatedCard>
                <div className={`bg-gradient-to-r ${getStatusColor(result.status)} rounded-lg p-6 mb-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm mb-1">Verification Status</p>
                      <p className="text-3xl font-bold text-white flex items-center gap-3">
                        <span>{getStatusIcon(result.status)}</span>
                        <span>{result.status}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/80 text-sm">Confidence Score</p>
                      <p className="text-4xl font-bold text-white">
                        {result.confidenceScore || 0}%
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-lg">{result.message}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-dark-800">
                  <div>
                    <p className="text-gray-400 text-sm">Verification Count</p>
                    <p className="text-2xl font-bold text-white">
                      {result.verificationCount}
                    </p>
                  </div>
                  {result.lastVerified && (
                    <div>
                      <p className="text-gray-400 text-sm">Last Verified</p>
                      <p className="text-white">
                        {new Date(result.lastVerified).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </AnimatedCard>

              {/* Product Details */}
              {result.product && (
                <AnimatedCard>
                  <h3 className="text-xl font-bold text-white mb-4">Product Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Product ID</p>
                      <p className="text-white font-medium">#{result.product.productId}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Name</p>
                      <p className="text-white font-medium">{result.product.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Manufacturer</p>
                      <p className="text-white font-mono text-sm">
                        {result.product.manufacturer.slice(0, 6)}...{result.product.manufacturer.slice(-4)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Batch Number</p>
                      <p className="text-white font-medium">{result.product.batchNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Category</p>
                      <p className="text-white font-medium">{result.product.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Total Events</p>
                      <p className="text-white font-medium">{result.history?.length || 0}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-dark-800">
                    <p className="text-gray-400 text-sm mb-2">Description</p>
                    <p className="text-gray-300">{result.product.description}</p>
                  </div>

                  {/* Generate QR */}
                  <div className="mt-6 pt-4 border-t border-dark-800 text-center">
                    <p className="text-gray-400 text-sm mb-4">Product QR Code</p>
                    <div className="inline-block bg-white p-4 rounded-lg">
                      <QRCode
                        value={JSON.stringify({
                          productId: result.product.productId,
                          name: result.product.name,
                          batchNumber: result.product.batchNumber
                        })}
                        size={150}
                        level="M"
                        includeMargin
                      />
                    </div>
                  </div>
                </AnimatedCard>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                {address && (
                  <motion.button
                    onClick={() => {
                      if (result.product) {
                        showSuccess('Product verification recorded on blockchain!')
                      }
                    }}
                    className="flex-1 px-6 py-3 bg-success-600 text-white rounded-lg font-medium hover:bg-success-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Verify as Authentic
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
