import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Heart, ShoppingCart, Truck, Shield, RefreshCw } from 'lucide-react'
import { useProductStore } from '../store/products'
import { useCartStore } from '../store/cart'
import { formatPrice } from '../lib/utils'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'

const ProductDetailPage = () => {
  const { id } = useParams()
  const { getProductById, products } = useProductStore()
  const { addItem } = useCartStore()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    // Simulate API call
    const fetchProduct = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      const foundProduct = getProductById(id)
      setProduct(foundProduct)
      setLoading(false)
    }

    fetchProduct()
  }, [id, getProductById])

  const handleAddToCart = () => {
    if (!product) return
    addItem(product, quantity)
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
    })
  }

  const relatedProducts = products
    .filter(p => p.id !== id && p.category === product?.category)
    .slice(0, 4)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-cinzel font-bold text-white mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-400 mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Button onClick={() => window.location.href = '/products'}>
            Browse Products
          </Button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specs', label: 'Specifications' },
    { id: 'reviews', label: 'Reviews' }
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <ol className="flex items-center space-x-2 text-sm text-gray-400">
            <li><a href="/" className="hover:text-gold">Home</a></li>
            <li>/</li>
            <li><a href="/products" className="hover:text-gold">Products</a></li>
            <li>/</li>
            <li className="text-white capitalize">{product.category}</li>
            <li>/</li>
            <li className="text-gold">{product.name}</li>
          </ol>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Swiper
              modules={[Navigation, Pagination, Thumbs]}
              thumbs={{ swiper: thumbsSwiper }}
              navigation
              pagination={{ clickable: true }}
              className="mb-4"
            >
              {product.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-full h-96 object-cover rounded-xl premium-glow"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <Swiper
              onSwiper={setThumbsSwiper}
              slidesPerView={4}
              spaceBetween={10}
              watchSlidesProgress
              className="thumbs-swiper"
            >
              {product.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={image}
                    alt={`${product.name} - Thumb ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-gold fill-current'
                        : 'text-gray-400'
                    }`}
                  />
                ))}
              </div>
              <span className="text-white">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-4xl font-cinzel font-bold text-white">
              {product.name}
            </h1>

            {/* Price */}
            <div className="text-3xl font-bold text-gold">
              {formatPrice(product.price)}
            </div>

            {/* Stock Status */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              product.inStock 
                ? 'bg-emerald/20 text-emerald border border-emerald/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </div>

            {/* Description */}
            <p className="text-gray-300 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-white font-semibold">Quantity:</label>
                <div className="flex items-center border border-gold/30 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gold hover:bg-gold/10 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-white border-x border-gold/30">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gold hover:bg-gold/10 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="secondary">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gold/20">
              <div className="flex items-center space-x-2 text-gray-300">
                <Truck className="w-5 h-5 text-gold" />
                <span className="text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Shield className="w-5 h-5 text-gold" />
                <span className="text-sm">Warranty</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <RefreshCw className="w-5 h-5 text-gold" />
                <span className="text-sm">Easy Returns</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <div className="bg-slate rounded-xl premium-glow overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-gold/20">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'text-gold border-b-2 border-gold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'description' && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="space-y-4">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gold/10">
                      <span className="text-gray-400 capitalize font-medium">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-white">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="text-center py-8">
                  <p className="text-gray-400">
                    Reviews feature coming soon. This product has {product.reviews} reviews 
                    with an average rating of {product.rating} stars.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-cinzel font-bold text-white mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="bg-slate rounded-xl p-4 premium-glow hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => window.location.href = `/product/${relatedProduct.id}`}
                >
                  <img
                    src={relatedProduct.images[0]}
                    alt={relatedProduct.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-white mb-2">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-gold font-bold">
                    {formatPrice(relatedProduct.price)}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  )
}

export default ProductDetailPage