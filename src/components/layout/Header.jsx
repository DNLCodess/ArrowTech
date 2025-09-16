"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, User, Menu, X, ArrowRight } from "lucide-react";
import { useCartStore } from "../../store/cart";
import { useAuthStore } from "../../store/auth";
import { useProductStore } from "../../store/products";
import Button from "../ui/Button";
import Cart from "../cart/Cart";
import AuthModal from "../auth/AuthModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { toggleCart, itemsCount } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const { setSearchQuery: setStoreSearchQuery } = useProductStore();

  const handleSearch = (e) => {
    e.preventDefault();
    setStoreSearchQuery(searchQuery);
    setIsSearchOpen(false);
    // Navigate to products page if not already there
    if (window.location.pathname !== "/products") {
      window.location.href = "/products";
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-md border-b border-gold/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.a
              href="/"
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="p-2 bg-gradient-to-br from-gold to-yellow-400 rounded-lg">
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-cinzel font-bold gradient-text">
                ArrowTech
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="/products"
                className="text-white hover:text-gold transition-colors"
              >
                Products
              </a>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-white hover:text-gold transition-colors"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleCart}
                className="relative p-2 text-white hover:text-gold transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gold text-primary text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
                  >
                    {itemsCount}
                  </motion.span>
                )}
              </motion.button>

              {/* User */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAuthModal(true)}
                className="p-2 text-white hover:text-gold transition-colors"
              >
                <User className="w-5 h-5" />
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-white hover:text-gold transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gold/20 bg-slate/50 backdrop-blur-md"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full bg-primary/50 border border-gold/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-gold"
                    autoFocus
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    Search
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-gold/20 bg-slate/50 backdrop-blur-md"
            >
              <nav className="px-4 py-4 space-y-4">
                <a
                  href="/"
                  className="block text-white hover:text-gold transition-colors"
                >
                  Home
                </a>
                <a
                  href="/products"
                  className="block text-white hover:text-gold transition-colors"
                >
                  Products
                </a>
                <a
                  href="/about"
                  className="block text-white hover:text-gold transition-colors"
                >
                  About
                </a>
                <a
                  href="/contact"
                  className="block text-white hover:text-gold transition-colors"
                >
                  Contact
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Cart Sidebar */}
      <Cart />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Header;
