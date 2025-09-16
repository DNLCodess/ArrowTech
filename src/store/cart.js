import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        if (!product?.price || isNaN(product.price)) {
          console.warn("Invalid product price:", product);
          return;
        }
        if (!Number.isInteger(quantity) || quantity <= 0) {
          console.warn("Invalid quantity:", quantity);
          quantity = 1; // Fallback to 1
        }
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
        console.log("Updated cart items:", get().items);
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
        console.log("Updated cart items after remove:", get().items);
      },

      updateQuantity: (productId, quantity) => {
        if (!Number.isInteger(quantity) || quantity <= 0) {
          console.warn("Invalid quantity, removing item:", productId, quantity);
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
        console.log("Updated cart items after quantity change:", get().items);
      },

      clearCart: () => {
        set({ items: [] });
        console.log("Cart cleared");
      },

      resetCart: () => {
        set({ items: [] });
        localStorage.removeItem("arrowtech-cart-storage");
        console.log("Cart reset and localStorage cleared");
      },

      toggleCart: () => set({ isOpen: !get().isOpen }),

      closeCart: () => set({ isOpen: false }),

      // Fixed: Convert getters to computed values that are reactive
      itemsCount: () => {
        return get().items.reduce(
          (total, item) => total + (Number(item.quantity) || 0),
          0
        );
      },

      total: () => {
        const items = get().items;
        console.log("Items for total calculation:", items);
        const total = items.reduce((acc, item, index) => {
          const price = Number(item.price || 0);
          const quantity = Number(item.quantity || 0);
          const itemTotal = price * quantity;
          console.log(
            `Item ${index}: price=${price}, quantity=${quantity}, itemTotal=${itemTotal}`
          );
          return acc + itemTotal;
        }, 0);
        const formattedTotal = Number(total.toFixed(2));
        console.log("Calculated total:", formattedTotal);
        return formattedTotal;
      },
    }),
    {
      name: "arrowtech-cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
