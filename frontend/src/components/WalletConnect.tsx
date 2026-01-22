import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWallet } from '@hooks/useWallet'
import { truncateAddress, formatBalance } from '@utils/security'
import { METAMASK_INSTALL_URL } from '@utils/constants'
import { showSuccess, showError, showWarning } from './Common/Notifications'

// Icons
const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)

const LogOutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

const RefreshCwIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

export default function WalletConnect() {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const { isConnected, address, balance, chainId, network, isCorrectNetwork, connect, disconnect, refreshBalance, switchNetwork, isInstalled } = useWallet()

  const handleConnect = async () => {
    try {
      const installed = await isInstalled()
      if (!installed) {
        showWarning('MetaMask is not installed. Please install it to continue.')
        window.open(METAMASK_INSTALL_URL, '_blank')
        return
      }

      await connect()
      showSuccess('Wallet connected successfully!')
    } catch (error: any) {
      showError(error.message || 'Failed to connect wallet')
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      setIsOpen(false)
      showSuccess('Wallet disconnected')
    } catch (error: any) {
      showError(error.message || 'Failed to disconnect wallet')
    }
  }

  const handleSwitchNetwork = async () => {
    try {
      await switchNetwork()
      showSuccess('Network switched successfully!')
    } catch (error: any) {
      showError(error.message || 'Failed to switch network')
    }
  }

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      showSuccess('Address copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleRefreshBalance = async () => {
    try {
      await refreshBalance()
      showSuccess('Balance refreshed!')
    } catch (error: any) {
      showError(error.message || 'Failed to refresh balance')
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.wallet-dropdown')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative">
      {!isConnected ? (
        <motion.button
          onClick={handleConnect}
          className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="hidden sm:inline">Connect Wallet</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </motion.button>
      ) : (
        <div className="wallet-dropdown">
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 ${
              !isCorrectNetwork
                ? 'bg-warning-600 text-white'
                : 'bg-dark-800 text-white border border-dark-700 hover:border-primary-500'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`w-2 h-2 rounded-full ${!isCorrectNetwork ? 'bg-white' : 'bg-success-500 animate-pulse'}`} />
            <span className="hidden sm:inline">{truncateAddress(address!)}</span>
            <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}><ChevronDownIcon /></span>
          </motion.button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-dark-800 border border-dark-700 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                {/* Network Status */}
                <div className={`p-4 border-b ${!isCorrectNetwork ? 'bg-warning-900/30' : 'bg-dark-900/50'}`}>
                  {!isCorrectNetwork ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-warning-400 text-sm font-medium">Wrong Network</p>
                        <p className="text-xs text-gray-400">Please switch to Polygon Mumbai</p>
                      </div>
                      <motion.button
                        onClick={handleSwitchNetwork}
                        className="px-3 py-1.5 bg-warning-600 text-white text-sm rounded-lg hover:bg-warning-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Switch
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-300 text-sm">{network}</p>
                        <p className="text-xs text-gray-500">Chain ID: {chainId}</p>
                      </div>
                      <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Balance */}
                <div className="p-4 border-b border-dark-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Balance</span>
                    <motion.button
                      onClick={handleRefreshBalance}
                      className="text-primary-400 hover:text-primary-300 transition-colors"
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <RefreshCwIcon />
                    </motion.button>
                  </div>
                  <p className="text-xl font-bold text-white">{formatBalance(balance)} MATIC</p>
                </div>

                {/* Address */}
                <div className="p-4 border-b border-dark-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Address</p>
                      <p className="text-sm font-mono text-white">{truncateAddress(address!)}</p>
                    </div>
                    <motion.button
                      onClick={handleCopyAddress}
                      className={`p-2 rounded-lg transition-colors ${copied ? 'bg-success-600 text-white' : 'bg-dark-700 text-gray-400 hover:bg-dark-600'}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <CopyIcon />
                    </motion.button>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-2">
                  <motion.button
                    onClick={handleDisconnect}
                    className="w-full px-4 py-3 bg-error-600/10 text-error-400 rounded-lg hover:bg-error-600/20 transition-colors flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogOutIcon />
                    <span>Disconnect Wallet</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
