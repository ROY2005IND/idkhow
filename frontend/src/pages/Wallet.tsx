import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useWallet } from '@hooks/useWallet'
import { truncateAddress, formatBalance } from '@utils/security'
import AnimatedCard from '@components/AnimatedCard'
import LoadingState from '@components/Common/LoadingState'

export default function Wallet() {
  const { isConnected, address, balance, chainId, network, isCorrectNetwork, refreshBalance } = useWallet()

  useEffect(() => {
    if (isConnected) {
      refreshBalance()
    }
  }, [isConnected])

  if (!isConnected) {
    return (
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <p className="text-gray-400 text-lg">Please connect your wallet first</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Wallet Profile</h1>
        <p className="text-gray-400">
          Manage your connected wallet and view account details
        </p>
      </motion.div>

      {/* Wallet Info Card */}
      <AnimatedCard>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-3xl">
              💼
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Connected Wallet</h2>
              <p className="text-gray-400">MetaMask</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg ${isCorrectNetwork ? 'bg-success-600/20 text-success-400' : 'bg-warning-600/20 text-warning-400'}`}>
            {isCorrectNetwork ? '✅ Correct Network' : '⚠️ Wrong Network'}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-dark-800 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Address</p>
            <p className="text-white font-mono">{truncateAddress(address!)}</p>
          </div>

          <div className="p-4 bg-dark-800 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Balance</p>
            <p className="text-2xl font-bold text-white">{formatBalance(balance!)} MATIC</p>
          </div>

          <div className="p-4 bg-dark-800 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Network</p>
            <p className="text-white font-medium">{network}</p>
          </div>

          <div className="p-4 bg-dark-800 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Chain ID</p>
            <p className="text-white font-medium">{chainId}</p>
          </div>
        </div>
      </AnimatedCard>

      {/* Network Info */}
      <AnimatedCard className="mt-6">
        <h3 className="text-xl font-bold text-white mb-4">Network Information</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
            <span className="text-gray-400">Network Name</span>
            <span className="text-white font-medium">{network}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
            <span className="text-gray-400">Chain ID</span>
            <span className="text-white font-medium">{chainId}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
            <span className="text-gray-400">Status</span>
            <span className={`font-medium ${isCorrectNetwork ? 'text-success-400' : 'text-warning-400'}`}>
              {isCorrectNetwork ? '✅ Connected & Correct' : '⚠️ Connected but Wrong Network'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
            <span className="text-gray-400">Currency</span>
            <span className="text-white font-medium">MATIC</span>
          </div>
        </div>
      </AnimatedCard>

      {/* Help Section */}
      <AnimatedCard className="mt-6">
        <h3 className="text-xl font-bold text-white mb-4">Need Help?</h3>

        <div className="space-y-3">
          <a
            href="https://faucet.polygon.technology/"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-primary-600/10 border border-primary-600/30 rounded-lg hover:bg-primary-600/20 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Get Testnet MATIC</p>
                <p className="text-gray-400 text-sm">Get free MATIC tokens on Mumbai testnet</p>
              </div>
              <span className="text-2xl">💰</span>
            </div>
          </a>

          <a
            href="https://mumbai.polygonscan.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-secondary-600/10 border border-secondary-600/30 rounded-lg hover:bg-secondary-600/20 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">View Transactions</p>
                <p className="text-gray-400 text-sm">Explore transactions on Mumbai explorer</p>
              </div>
              <span className="text-2xl">🔍</span>
            </div>
          </a>
        </div>
      </AnimatedCard>
    </div>
  )
}
