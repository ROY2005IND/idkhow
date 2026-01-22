import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ErrorBoundary } from '@components/Common/ErrorBoundary'
import { Navbar } from '@components/Navbar'
import { Notifications } from '@components/Common/Notifications'

// Pages
import Home from '@pages/Home'
import Dashboard from '@pages/Dashboard'
import RegisterProduct from '@pages/RegisterProduct'
import TrackProduct from '@pages/TrackProduct'
import VerifyProduct from '@pages/VerifyProduct'
import Wallet from '@pages/Wallet'
import Analytics from '@pages/Analytics'
import NotFound from '@pages/NotFound'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-dark-950 text-white font-sans">
          <Navbar />
          <Notifications />

          <main className="min-h-screen">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/register-product" element={<RegisterProduct />} />
                <Route path="/track" element={<TrackProduct />} />
                <Route path="/track/:productId" element={<TrackProduct />} />
                <Route path="/verify" element={<VerifyProduct />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </AnimatePresence>
          </main>

          {/* Footer */}
          <footer className="py-8 px-4 border-t border-dark-800">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-gray-400">
                © 2024 VeriChain Supply. Built with ❤️ using 100% free open-source technologies.
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
