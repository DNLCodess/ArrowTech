import { motion } from 'framer-motion'
import { Filter } from 'lucide-react'
import { useProductStore } from '../../store/products'
import { categories } from '../../data/products'

const ProductFilters = () => {
  const { selectedCategory, setCategory, sortBy, setSortBy } = useProductStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate rounded-xl p-6 premium-glow mb-8"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Filter className="w-5 h-5 text-gold" />
        <h3 className="font-cinzel font-semibold text-white">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-primary border border-gold/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-primary border border-gold/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductFilters