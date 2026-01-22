import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import WalletConnect from './WalletConnect'

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/register-product', label: 'Register', icon: '➕' },
  { path: '/track', label: 'Track', icon: '🔍' },
  { path: '/verify', label: 'Verify', icon: '✅' },
  { path: '/wallet', label: 'Wallet', icon: '💼' },
  { path: '/analytics', label: 'Analytics', icon: '📈' }
]

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-md border-b border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              🔗 VeriChain
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <motion.button
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-primary-600/20 text-primary-400'
                      : 'text-gray-400 hover:text-white hover:bg-dark-800'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mr-1">{item.icon}</span>
                  <span>{item.label}</span>
                </motion.button>
              </Link>
            ))}
          </div>

          {/* Wallet Connect */}
          <div className="flex items-center gap-4">
            <WalletConnect />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-dark-800 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <motion.button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-primary-600/20 text-primary-400'
                  : 'text-gray-400 hover:text-white hover:bg-dark-800'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.icon} {item.label}
            </motion.button>
          </Link>
        ))}
      </div>
    </nav>
  )
}
