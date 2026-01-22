import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { useAsync } from '@hooks/useAsync'
import { apiService } from '@services/apiService'
import { DashboardStats, RecentProduct, RecentEvent } from '@types/api.types'
import AnimatedCard from '@components/AnimatedCard'
import LoadingState from '@components/Common/LoadingState'
import { format } from 'date-fns'

export default function Dashboard() {
  const { isAuthenticated } = useAuth()

  // Fetch stats
  const { data: stats, loading: statsLoading } = useAsync(() => apiService.getDashboardStats())

  // Fetch recent products
  const { data: recentProducts, loading: productsLoading } = useAsync(() =>
    apiService.getRecentProducts(5)
  )

  // Fetch recent events
  const { data: recentEvents, loading: eventsLoading } = useAsync(() =>
    apiService.getRecentEvents(5)
  )

  const statCards = [
    {
      label: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: '📦',
      color: 'from-primary-500 to-primary-600',
      path: '/analytics'
    },
    {
      label: 'Total Events',
      value: stats?.totalEvents || 0,
      icon: '⛓️',
      color: 'from-secondary-500 to-secondary-600',
      path: '/analytics'
    },
    {
      label: 'Verified Products',
      value: stats?.verifiedProducts || 0,
      icon: '✅',
      color: 'from-success-500 to-success-600',
      path: '/analytics'
    },
    {
      label: 'Pending Verifications',
      value: stats?.pendingVerifications || 0,
      icon: '⏳',
      color: 'from-warning-500 to-warning-600',
      path: '/analytics'
    }
  ]

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Welcome to VeriChain Supply - Your blockchain supply chain management platform
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <Link key={card.label} to={card.path}>
            <AnimatedCard delay={index * 0.1}>
              <div className={`bg-gradient-to-br ${card.color} rounded-lg p-4 mb-4`}>
                <span className="text-3xl">{card.icon}</span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{card.label}</h3>
              {statsLoading ? (
                <div className="h-8 w-20 bg-dark-800 rounded animate-pulse" />
              ) : (
                <p className="text-3xl font-bold text-white">{card.value.toLocaleString()}</p>
              )}
            </AnimatedCard>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <AnimatedCard className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/register-product">
            <motion.button
              className="p-4 bg-primary-600/10 border border-primary-600/30 rounded-lg hover:bg-primary-600/20 transition-colors text-left"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-2xl mb-2 block">➕</span>
              <span className="text-white font-medium">Register Product</span>
            </motion.button>
          </Link>

          <Link to="/track">
            <motion.button
              className="p-4 bg-secondary-600/10 border border-secondary-600/30 rounded-lg hover:bg-secondary-600/20 transition-colors text-left"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-2xl mb-2 block">🔍</span>
              <span className="text-white font-medium">Track Product</span>
            </motion.button>
          </Link>

          <Link to="/verify">
            <motion.button
              className="p-4 bg-success-600/10 border border-success-600/30 rounded-lg hover:bg-success-600/20 transition-colors text-left"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-2xl mb-2 block">✅</span>
              <span className="text-white font-medium">Verify Product</span>
            </motion.button>
          </Link>

          <Link to="/wallet">
            <motion.button
              className="p-4 bg-warning-600/10 border border-warning-600/30 rounded-lg hover:bg-warning-600/20 transition-colors text-left"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-2xl mb-2 block">💼</span>
              <span className="text-white font-medium">View Wallet</span>
            </motion.button>
          </Link>
        </div>
      </AnimatedCard>

      {/* Recent Products & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <AnimatedCard delay={0.3}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Recent Products</h2>
            <Link to="/analytics" className="text-primary-400 hover:text-primary-300 text-sm">
              View All →
            </Link>
          </div>
          {productsLoading ? (
            <LoadingState text="Loading products..." />
          ) : recentProducts && recentProducts.length > 0 ? (
            <div className="space-y-3">
              {recentProducts.map((product, index) => (
                <motion.div
                  key={product.productId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-gray-400 text-sm">
                        ID: #{product.productId} • {product.category}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(new Date(product.createdAt), 'MMM dd')}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No products yet</p>
          )}
        </AnimatedCard>

        {/* Recent Events */}
        <AnimatedCard delay={0.4}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Recent Events</h2>
            <Link to="/analytics" className="text-primary-400 hover:text-primary-300 text-sm">
              View All →
            </Link>
          </div>
          {eventsLoading ? (
            <LoadingState text="Loading events..." />
          ) : recentEvents && recentEvents.length > 0 ? (
            <div className="space-y-3">
              {recentEvents.map((event, index) => (
                <motion.div
                  key={event.eventId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{event.eventType}</p>
                      <p className="text-gray-400 text-sm">
                        {event.productName} • {event.location}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(new Date(event.timestamp), 'MMM dd')}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No events yet</p>
          )}
        </AnimatedCard>
      </div>
    </div>
  )
}
