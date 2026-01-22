import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useWallet } from '@hooks/useWallet'
import { web3Service } from '@services/web3Service'
import { showSuccess, showError, showInfo } from '@components/Common/Notifications'
import AnimatedCard from '@components/AnimatedCard'
import LoadingState from '@components/Common/LoadingState'
import { PRODUCT_CATEGORIES } from '@utils/constants'

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters').max(100),
  batchNumber: z.string().min(1, 'Batch number is required').max(50),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  category: z.string().min(1, 'Category is required')
})

type ProductFormData = z.infer<typeof productSchema>

export default function RegisterProduct() {
  const navigate = useNavigate()
  const { address, isConnected } = useWallet()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [estimatedGas, setEstimatedGas] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema)
  })

  const onSubmit = async (data: ProductFormData) => {
    if (!isConnected || !address) {
      showError('Please connect your wallet first')
      return
    }

    setIsSubmitting(true)

    try {
      showInfo('Initiating product registration...')

      const result = await web3Service.registerProduct(
        data.name,
        data.batchNumber,
        data.description,
        data.category,
        address
      )

      showSuccess(`Product registered successfully! Product ID: ${result.productId}`)
      navigate(`/track/${result.productId}`)
    } catch (error: any) {
      showError(error.message || 'Failed to register product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Register Product</h1>
        <p className="text-gray-400">
          Register a new product on the blockchain supply chain
        </p>
      </motion.div>

      <AnimatedCard>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Name
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error-400">{errors.name.message}</p>
            )}
          </div>

          {/* Batch Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Batch Number
            </label>
            <input
              type="text"
              {...register('batchNumber')}
              className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              placeholder="e.g., BATCH-2024-001"
            />
            {errors.batchNumber && (
              <p className="mt-1 text-sm text-error-400">{errors.batchNumber.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              {...register('category')}
              className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            >
              <option value="">Select a category</option>
              {PRODUCT_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-error-400">{errors.category.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors resize-none"
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-error-400">{errors.description.message}</p>
            )}
          </div>

          {/* Gas Estimate */}
          {estimatedGas && (
            <div className="p-4 bg-dark-800 rounded-lg border border-dark-700">
              <p className="text-gray-400 text-sm">Estimated Gas Cost</p>
              <p className="text-xl font-bold text-white">{estimatedGas} MATIC</p>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting || !isConnected}
            className={`w-full py-4 rounded-lg font-medium text-white transition-all duration-300 ${
              isSubmitting || !isConnected
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:shadow-lg hover:shadow-primary-500/25'
            }`}
            whileHover={isSubmitting || !isConnected ? {} : { scale: 1.02 }}
            whileTap={isSubmitting || !isConnected ? {} : { scale: 0.98 }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingState size="sm" />
                Registering Product...
              </span>
            ) : (
              'Register Product on Blockchain'
            )}
          </motion.button>

          {!isConnected && (
            <p className="text-center text-warning-400 text-sm">
              ⚠️ Please connect your wallet to register products
            </p>
          )}
        </form>
      </AnimatedCard>
    </div>
  )
}
