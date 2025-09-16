import { motion, AnimatePresence } from 'framer-motion'
import { useProductStore } from '../../store/products'
import ProductCard from './ProductCard'
import LoadingSpinner from '../ui/LoadingSpinner'

const ProductGrid = () => {
  const { filteredProducts, loading } = useProductStore()

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (filteredProducts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <h3 className="text-2xl font-cinzel text-white mb-4">No products found</h3>
        <p className="text-gray-400">Try adjusting your filters or search terms</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <AnimatePresence>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

export default ProductGrid