import { motion } from 'framer-motion'

interface LoadingStateProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  className?: string
}

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
  xl: 'w-16 h-16 border-4'
}

export default function LoadingState({ size = 'md', text, className = '' }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        className={`rounded-full border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent ${sizes[size]}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      {text && (
        <motion.p
          className="mt-4 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`bg-dark-900 rounded-xl p-6 border border-dark-800 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="h-6 bg-dark-800 rounded w-3/4 mb-4 animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 bg-dark-800 rounded w-full animate-pulse" />
        <div className="h-4 bg-dark-800 rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-dark-800 rounded w-4/6 animate-pulse" />
      </div>
    </motion.div>
  )
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4 p-3 bg-dark-900 rounded-lg">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className={`h-4 bg-dark-800 rounded animate-pulse ${i === 0 ? 'w-1/4' : 'flex-1'}`} />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-3 border border-dark-800 rounded-lg">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className={`h-4 bg-dark-800 rounded animate-pulse ${colIndex === 0 ? 'w-1/4' : 'flex-1'}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
