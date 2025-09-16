import { motion } from 'framer-motion'
import { ArrowLeft, Search } from 'lucide-react'
import Button from '../components/ui/Button'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Number */}
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-9xl font-cinzel font-bold gradient-text leading-none">
              404
            </h1>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-cinzel font-semibold text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              The premium experience you're looking for seems to have taken a different path. 
              Let's get you back to exploring our exceptional collection.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => window.location.href = '/'}
              className="group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => window.location.href = '/products'}
            >
              <Search className="w-5 h-5 mr-2" />
              Browse Products
            </Button>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 opacity-20"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-2 border-gold rounded-full animate-pulse" />
              </div>
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-400 rounded-full animate-bounce" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFoundPage