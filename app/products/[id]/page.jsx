"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

import { useProductStore } from "../../../src/store/products";
import { useCartStore } from "../../../src/store/cart";
import Button from "../../../src/components/ui/Button";
import LoadingSpinner from "../../../src/components/ui/LoadingSpinner";
import { formatPrice } from "../../../src/lib/utils";

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id;

  const { getProductById, products } = useProductStore();
  const { addItem } = useCartStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !productId) return;

    const fetchProduct = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      const foundProduct = getProductById(productId);
      setProduct(foundProduct);
      setLoading(false);
    };

    fetchProduct();
  }, [productId, getProductById, mounted]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold"></div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product) return;

    const success = addItem(product, quantity);
    if (success) {
      toast.success(`${product.name} added to cart!`, {
        icon: "🛒",
      });
    } else {
      toast.error("Failed to add item to cart");
    }
  };

  const handleBackToProducts = () => {
    router.push("/products");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleProductClick = (relatedProductId) => {
    router.push(`/products/${relatedProductId}`);
  };

  const relatedProducts = products
    .filter((p) => p.id !== productId && p.category === product?.category)
    .slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-cinzel font-bold text-white mb-4">
              Product Not Found
            </h1>
            <p className="text-gray-400 mb-8">
              The product you're looking for doesn't exist.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleBackToProducts} className="group">
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Products
              </Button>
              <Button variant="secondary" onClick={handleGoHome}>
                Go Home
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specs", label: "Specifications" },
    { id: "reviews", label: "Reviews" },
  ];

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
            <li>
              <button
                onClick={handleGoHome}
                className="hover:text-gold transition-colors"
              >
                Home
              </button>
            </li>
            <li>/</li>
            <li>
              <button
                onClick={handleBackToProducts}
                className="hover:text-gold transition-colors"
              >
                Products
              </button>
            </li>
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
            {product.images && product.images.length > 0 ? (
              <>
                <Swiper
                  modules={[Navigation, Pagination, Thumbs]}
                  thumbs={{
                    swiper:
                      thumbsSwiper && !thumbsSwiper.destroyed
                        ? thumbsSwiper
                        : null,
                  }}
                  navigation
                  pagination={{ clickable: true }}
                  className="mb-4"
                  key="main-swiper"
                >
                  {product.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        className="w-full h-96 object-cover rounded-xl premium-glow"
                        onError={(e) => {
                          e.target.src = "/images/placeholder-product.jpg";
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {product.images.length > 1 && (
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    slidesPerView={Math.min(4, product.images.length)}
                    spaceBetween={10}
                    watchSlidesProgress
                    className="thumbs-swiper"
                    key="thumbs-swiper"
                  >
                    {product.images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={image}
                          alt={`${product.name} - Thumb ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                          onError={(e) => {
                            e.target.src = "/images/placeholder-product.jpg";
                          }}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </>
            ) : (
              <div className="w-full h-96 bg-slate rounded-xl flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
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
                      i < Math.floor(product.rating || 0)
                        ? "text-gold fill-current"
                        : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
              <span className="text-white">
                {product.rating || 0} ({product.reviews || 0} reviews)
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
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                product.inStock
                  ? "bg-emerald/20 text-emerald border border-emerald/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
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
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-white border-x border-gold/30 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gold hover:bg-gold/10 transition-colors"
                    disabled={quantity >= 10} // Max quantity limit
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
                <Button variant="secondary" className="px-4">
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
            <div className="flex border-b border-gold/20 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-gold border-b-2 border-gold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "description" && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed">
                    {product.description || "No description available."}
                  </p>
                </div>
              )}

              {activeTab === "specs" && (
                <div className="space-y-4">
                  {product.specs && Object.keys(product.specs).length > 0 ? (
                    Object.entries(product.specs).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between py-2 border-b border-gold/10 last:border-b-0"
                      >
                        <span className="text-gray-400 capitalize font-medium">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span className="text-white">{value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">
                      No specifications available.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="text-center py-8">
                  <p className="text-gray-400">
                    Reviews feature coming soon. This product has{" "}
                    {product.reviews || 0} reviews with an average rating of{" "}
                    {product.rating || 0} stars.
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
                <motion.div
                  key={relatedProduct.id}
                  whileHover={{ y: -5 }}
                  className="bg-slate rounded-xl p-4 premium-glow hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => handleProductClick(relatedProduct.id)}
                >
                  <img
                    src={
                      relatedProduct.images?.[0] ||
                      "/images/placeholder-product.jpg"
                    }
                    alt={relatedProduct.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.target.src = "/images/placeholder-product.jpg";
                    }}
                  />
                  <h3 className="font-semibold text-white mb-2 truncate">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-gold font-bold">
                    {formatPrice(relatedProduct.price)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
