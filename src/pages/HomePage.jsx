import { motion } from 'framer-motion'
import { ArrowRight, Star, Shield, Truck, HeadphonesIcon } from 'lucide-react'
import { useProductStore } from '../store/products'
import { testimonials } from '../data/products'
import ProductCard from '../components/products/ProductCard'
import Button from '../components/ui/Button'

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

const HomePage = () => {
  const { getFeaturedProducts } = useProductStore()
  const featuredProducts = getFeaturedProducts()

  const features = [
    {
      icon: Shield,
      title: 'Premium Quality',
      description: 'Only the finest tech products that meet our rigorous standards'
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Free express delivery on orders over $500, worldwide coverage'
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Expert customer service available around the clock'
    }
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Background Video/Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
            alt="Tech workspace"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-cinzel font-bold mb-6"
            >
              <span className="gradient-text">Elevate Your</span>
              <br />
              <span className="text-white">Tech Arsenal</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8 leading-relaxed"
            >
              Discover premium technology that transforms your digital experience. 
              From cutting-edge smartphones to revolutionary laptops, we curate only the finest.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Button
                onClick={() => window.location.href = '/products'}
                className="group"
              >
                Explore Collection
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                variant="secondary"
                onClick={() => document.getElementById('featured').scrollIntoView({ behavior: 'smooth' })}
              >
                View Featured
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-10 opacity-10">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-32 h-32 border border-gold rounded-full"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 premium-hover"
              >
                <div className="inline-flex p-4 bg-gradient-to-br from-gold to-yellow-400 rounded-full mb-6">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-cinzel font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-cinzel font-bold text-white mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Handpicked premium devices that represent the pinnacle of technology and design
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              onClick={() => window.location.href = '/products'}
              variant="secondary"
            >
              View All Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-cinzel font-bold text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-400">
              Join thousands of satisfied customers who trust ArrowTech
            </p>
          </motion.div>

          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5000 }}
            pagination={{ clickable: true }}
            loop={true}
            className="pb-12"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="max-w-4xl mx-auto text-center px-8"
                >
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-gold fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-2xl font-light text-white mb-8 italic leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div>
                    <cite className="text-gold font-semibold text-lg not-italic">
                      {testimonial.name}
                    </cite>
                    <p className="text-gray-400 mt-1">{testimonial.role}</p>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-cinzel font-bold text-white mb-6">
              Ready to Elevate Your Tech Experience?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Discover the perfect blend of innovation, design, and performance
            </p>
            <Button
              onClick={() => window.location.href = '/products'}
              size="lg"
              className="group"
            >
              Start Shopping
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage