import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@hooks/useAuth'
import AnimatedCard from '@components/AnimatedCard'

export default function Home() {
  const { isAuthenticated, login } = useAuth()

  const features = [
    {
      icon: '🏭',
      title: 'Product Registration',
      description: 'Manufacturers can register products on the blockchain with complete traceability',
      link: '/register-product',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: '🔗',
      title: 'Supply Chain Tracking',
      description: 'Track products through every stage of the supply chain journey',
      link: '/track',
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      icon: '✅',
      title: 'Product Verification',
      description: 'Verify product authenticity using QR codes and blockchain records',
      link: '/verify',
      color: 'from-success-500 to-success-600'
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Monitor supply chain metrics and product statistics',
      link: '/analytics',
      color: 'from-warning-500 to-warning-600'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-40 h-40 bg-secondary-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -50, 0]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/3 w-36 h-36 bg-success-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              y: [0, 30, 0]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-6xl mb-6"
              >
                🔗
              </motion.div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                VeriChain{' '}
                <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                  Supply
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Decentralized supply chain tracking and product authentication platform powered by blockchain technology.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <motion.button
                      className="px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Go to Dashboard
                    </motion.button>
                  </Link>
                ) : (
                  <motion.button
                    onClick={() => login().catch(() => {})}
                    className="px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Connect Wallet to Start
                  </motion.button>
                )}

                <Link to="/verify">
                  <motion.button
                    className="px-8 py-4 bg-dark-800 text-white rounded-lg font-medium border border-dark-700 hover:bg-dark-700 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Verify Product
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Right Content - Animated Blockchain */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Blockchain Blocks */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{ left: `${i * 80}px`, top: `${50 + (i % 2) * 60}px` }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.2, duration: 0.5 }}
                  >
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-lg shadow-primary-500/30 flex items-center justify-center text-2xl"
                      animate={{
                        y: [0, -20, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: 'easeInOut'
                      }}
                    >
                      ⛓️
                    </motion.div>
                  </motion.div>
                ))}

                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ top: -20, left: 0 }}>
                  <motion.line
                    x1="40"
                    y1="70"
                    x2="120"
                    y2="90"
                    stroke="rgba(14, 165, 233, 0.3)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                  />
                  <motion.line
                    x1="120"
                    y1="90"
                    x2="200"
                    y2="70"
                    stroke="rgba(168, 85, 247, 0.3)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Blockchain-Powered Supply Chain
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Every product is recorded on the blockchain, ensuring complete transparency and
              authenticity throughout the supply chain journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Link key={feature.title} to={feature.link}>
                <AnimatedCard delay={index * 0.1} hover={true}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`bg-gradient-to-br ${feature.color} w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-4`}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </AnimatedCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedCard>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              100% FREE Stack 🎉
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
              {['React', 'TypeScript', 'Tailwind', 'Framer Motion', 'Web3.js', 'MetaMask'].map((tech) => (
                <motion.div
                  key={tech}
                  className="p-4 bg-dark-800 rounded-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <p className="text-white font-medium">{tech}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-gray-400 mt-6">
              All open-source, all free, all ready for production! 💪
            </p>
          </AnimatedCard>
        </div>
      </section>
    </div>
  )
}
