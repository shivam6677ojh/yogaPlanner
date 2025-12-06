import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = ({ size = 'medium', fullScreen = false, message = 'Loading...' }) => {
  const sizeClasses = {
    small: { container: 'w-12 h-12', lotus: 'w-8 h-8' },
    medium: { container: 'w-20 h-20', lotus: 'w-14 h-14' },
    large: { container: 'w-32 h-32', lotus: 'w-24 h-24' }
  }

  const containerClass = fullScreen 
    ? 'fixed inset-0 flex flex-col justify-center items-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 z-50'
    : 'flex flex-col justify-center items-center py-8'

  return (
    <div className={containerClass}>
      {/* Animated Lotus Flower */}
      <div className="relative">
        {/* Outer Petals */}
        <motion.div
          className={`${sizeClasses[size].container} relative`}
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-3 h-6 bg-gradient-to-t from-purple-400 to-pink-300 rounded-full"
              style={{
                transformOrigin: 'center',
                transform: `rotate(${i * 45}deg) translateY(-${size === 'small' ? '16' : size === 'medium' ? '28' : '44'}px)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </motion.div>

        {/* Center Om Symbol */}
        <motion.div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${sizeClasses[size].lotus} bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg`}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <span className="text-white font-bold" style={{ fontSize: size === 'small' ? '16px' : size === 'medium' ? '24px' : '36px' }}>
            ॐ
          </span>
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.p
        className="mt-6 text-purple-600 font-medium text-lg"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {message}
      </motion.p>

      {/* Breathing Animation Text */}
      <motion.p
        className="mt-2 text-sm text-gray-500 italic"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        Breathe in... Breathe out...
      </motion.p>
    </div>
  )
}

export default LoadingSpinner