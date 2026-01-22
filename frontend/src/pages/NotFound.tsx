import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AnimatedCard from '@components/AnimatedCard'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <AnimatedCard className="text-center max-w-lg">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-8xl mb-6"
        >
          🔍
        </motion.div>

        <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link to="/">
          <motion.button
            className="px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Back Home
          </motion.button>
        </Link>
      </AnimatedCard>
    </div>
  )
}
