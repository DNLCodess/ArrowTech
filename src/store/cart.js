import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        // Validation checks with proper return values
        if (!product?.id) {
          console.warn("Product missing ID:", product);
          return false;
        }

        if (!product?.price || isNaN(product.price)) {
          console.warn("Invalid product price:", product);
          return false;
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
          console.warn("Invalid quantity:", quantity);
          quantity = 1; // Fallback to 1
        }

        try {
          const items = get().items;
          const existingItem = items.find((item) => item.id === product.id);

          if (existingItem) {
            set({
              items: items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            });
          } else {
            set({
              items: [
                ...items,
                { ...product, quantity, price: Number(product.price) },
              ],
            });
          }

          return true; // Success
        } catch (error) {
          console.error("Error adding item to cart:", error);
          return false; // Failure
        }
      },

      removeItem: (productId) => {
        if (!productId) {
          console.warn("No product ID provided");
          return false;
        }

        try {
          set({
            items: get().items.filter((item) => item.id !== productId),
          });

          return true;
        } catch (error) {
          console.error("Error removing item:", error);
          return false;
        }
      },

      updateQuantity: (productId, quantity) => {
        if (!productId) {
          console.warn("No product ID provided");
          return false;
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
          console.warn("Invalid quantity, removing item:", productId, quantity);
          return get().removeItem(productId);
        }

        try {
          set({
            items: get().items.map((item) =>
              item.id === productId ? { ...item, quantity } : item
            ),
          });

          return true;
        } catch (error) {
          console.error("Error updating quantity:", error);
          return false;
        }
      },

      clearCart: () => {
        try {
          set({ items: [] });

          return true;
        } catch (error) {
          console.error("Error clearing cart:", error);
          return false;
        }
      },

      resetCart: () => {
        try {
          set({ items: [] });
          if (typeof window !== "undefined") {
            localStorage.removeItem("arrowtech-cart-storage");
          }

          return true;
        } catch (error) {
          console.error("Error resetting cart:", error);
          return false;
        }
      },

      toggleCart: () => set({ isOpen: !get().isOpen }),

      closeCart: () => set({ isOpen: false }),

      openCart: () => set({ isOpen: true }),

      // Helper methods
      hasItem: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      getItem: (productId) => {
        return get().items.find((item) => item.id === productId);
      },

      // Getter functions that return computed values
      getItemsCount: () => {
        return get().items.reduce(
          (total, item) => total + (Number(item.quantity) || 0),
          0
        );
      },

      getTotal: () => {
        const items = get().items;

        const total = items.reduce((acc, item) => {
          const price = Number(item.price || 0);
          const quantity = Number(item.quantity || 0);
          const itemTotal = price * quantity;

          return acc + itemTotal;
        }, 0);
        const formattedTotal = Number(total.toFixed(2));

        return formattedTotal;
      },
    }),
    {
      name: "arrowtech-cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// Export selectors for easier usage
export const useCartItemsCount = () =>
  useCartStore((state) => state.getItemsCount());
export const useCartTotal = () => useCartStore((state) => state.getTotal());
