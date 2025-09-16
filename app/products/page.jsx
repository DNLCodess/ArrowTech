"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useProductStore } from "../../src/store/products";
import ProductFilters from "../../src/components/products/ProductFilters";
import ProductGrid from "../../src/components/products/ProductGrid";

const ProductsPage = () => {
  const { setLoading, filteredProducts } = useProductStore();

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [setLoading]);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-cinzel font-bold text-white mb-4">
            Premium Tech Collection
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Explore our curated selection of cutting-edge technology products,
            designed for those who demand excellence.
          </p>
          <div className="mt-4 flex items-center text-gold">
            <span>{filteredProducts.length} products</span>
          </div>
        </motion.div>

        {/* Filters */}
        <ProductFilters />

        {/* Products Grid */}
        <ProductGrid />
      </div>
    </div>
  );
};

export default ProductsPage;
