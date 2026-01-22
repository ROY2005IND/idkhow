import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  delay?: number
}

export default function AnimatedCard({ children, className = '', hover = true, delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={hover ? { y: -5, boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)' } : {}}
      className={`bg-dark-900 border border-dark-800 rounded-xl p-6 ${hover ? 'cursor-pointer transition-all duration-300' : ''} ${className}`}
    >
      {children}
    </motion.div>
  )
}
