import { create } from 'zustand';
import { CartItem, MenuItem } from '@/lib/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (menuItem: MenuItem, quantity: number, variants: CartItem['selectedVariants'], addons: CartItem['selectedAddons'], notes?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

function calculateSubtotal(menuItem: MenuItem, quantity: number, variants: CartItem['selectedVariants'], addons: CartItem['selectedAddons']): number {
  const variantExtra = variants.reduce((sum, v) => sum + v.priceAdjustment, 0);
  const addonExtra = addons.reduce((sum, a) => sum + a.price, 0);
  return (menuItem.price + variantExtra + addonExtra) * quantity;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (menuItem, quantity, variants, addons, notes) => {
    const subtotal = calculateSubtotal(menuItem, quantity, variants, addons);
    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      menuItem,
      quantity,
      selectedVariants: variants,
      selectedAddons: addons,
      notes,
      subtotal,
    };
    set((state) => ({ items: [...state.items, newItem] }));
  },

  removeItem: (id) => {
    set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
  },

  updateQuantity: (id, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? { ...item, quantity, subtotal: calculateSubtotal(item.menuItem, quantity, item.selectedVariants, item.selectedAddons) }
          : item
      ),
    }));
  },

  clearCart: () => set({ items: [] }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  setCartOpen: (open) => set({ isOpen: open }),

  getTotal: () => get().items.reduce((sum, item) => sum + item.subtotal, 0),
  getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
