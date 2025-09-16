import { motion } from "framer-motion";
import { Star, ShoppingCart } from "lucide-react";
import { useCartStore } from "../../store/cart";
import { formatPrice } from "../../lib/utils";
import Button from "../ui/Button";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Adding product:", product);
    // Fixed: Pass only product, quantity defaults to 1
    addItem(product);
    toast.success(`${product.name} added to cart!`, {
      icon: "🛒",
    });
  };

  const handleCardClick = () => {
    window.location.href = `/products/${product.id}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -10 }}
      onClick={handleCardClick}
      className="group cursor-pointer bg-slate rounded-xl overflow-hidden premium-glow hover:shadow-2xl hover:shadow-gold/30 transition-all duration-500"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Product Status Badges */}
        <div className="absolute top-4 left-4 space-y-2">
          {product.featured && (
            <span className="px-2 py-1 bg-gold text-primary text-xs font-semibold rounded">
              Featured
            </span>
          )}
          {!product.inStock && (
            <span className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick Add Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4"
        >
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6">
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "text-gold fill-current"
                    : "text-gray-400"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-400">
            ({product.reviews} reviews)
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-cinzel font-semibold text-lg text-white mb-2 group-hover:text-gold transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gold">
            {formatPrice(product.price)}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
