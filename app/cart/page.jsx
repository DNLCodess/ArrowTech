"use client";

import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../src/components/ui/Button";
import { useCartStore } from "../../src/store/cart";
import { formatPrice } from "../../src/lib/utils";

const CartPage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const resetCart = useCartStore((state) => state.resetCart);

  // Fixed: Get computed values by calling the functions
  const totalFn = useCartStore((state) => state.total);
  const itemsCountFn = useCartStore((state) => state.itemsCount);

  const total = totalFn();
  const itemsCount = itemsCountFn();

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold"></div>
      </div>
    );
  }

  const handleCheckout = () => {
    if (total <= 0) {
      alert(
        "Cannot proceed to checkout with a zero total. Please reset cart or add valid items."
      );
      return;
    }
    router.push("/checkout");
  };

  const handleContinueShopping = () => {
    router.push("/products");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h1 className="font-cinzel font-bold text-white text-4xl mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Discover our premium collection and add some products to your cart.
          </p>
          <div className="space-y-4">
            <Button onClick={handleContinueShopping}>Continue Shopping</Button>
            <Button onClick={resetCart} variant="secondary">
              Reset Cart (Debug)
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-cinzel font-bold text-white text-4xl mb-4">
            Shopping Cart
          </h1>
          <p className="text-xl text-gray-400">
            {itemsCount} {itemsCount === 1 ? "item" : "items"} in your cart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-slate rounded-xl p-6 premium-glow"
              >
                <div className="flex items-center space-x-6">
                  <img
                    src={item.images?.[0] || "/images/placeholder-product.jpg"}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = "/images/placeholder-product.jpg";
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-cinzel font-semibold text-white text-lg mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {item.description
                        ? `${item.description.substring(0, 100)}...`
                        : "No description available"}
                    </p>
                    <p className="text-2xl font-bold text-gold">
                      {item.price
                        ? formatPrice(item.price)
                        : "Price Unavailable"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gold/30 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-2 text-gray-400 hover:text-gold transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 text-white font-semibold min-w-[3rem] text-center">
                        {item.quantity || 0}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2 text-gold hover:bg-gold/10 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate rounded-xl p-6 premium-glow sticky top-8"
            >
              <h2 className="font-cinzel font-semibold text-white text-xl mb-6">
                Order Summary
              </h2>
              {total <= 0 ? (
                <div className="text-center text-gray-400 mb-6">
                  <p>Cart total is invalid. Please reset cart or add items.</p>
                  <Button
                    onClick={resetCart}
                    variant="secondary"
                    className="mt-4"
                  >
                    Reset Cart
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-emerald">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tax</span>
                    <span className="text-white">
                      {formatPrice(total * 0.08)}
                    </span>
                  </div>
                  <hr className="border-gold/20" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-gold">
                      {formatPrice(total * 1.08)}
                    </span>
                  </div>
                </div>
              )}
              <Button
                onClick={handleCheckout}
                className="w-full"
                disabled={total <= 0}
              >
                Proceed to Checkout
              </Button>
              <div className="mt-4 text-center space-y-2">
                <button
                  onClick={handleContinueShopping}
                  className="text-gold hover:text-gold/80 transition-colors"
                >
                  Continue Shopping
                </button>
                <br />
                <Button
                  onClick={resetCart}
                  variant="secondary"
                  className="w-full"
                >
                  Reset Cart (Debug)
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
