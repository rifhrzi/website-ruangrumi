import { create } from 'zustand';
import type { CartItem, MenuItem, OrderType, PaymentMethod, Table } from '@/lib/types';

const TAX_RATE = 0.11;
const SERVICE_CHARGE_RATE = 0.05;

function calculateItemSubtotal(
  menuItem: MenuItem,
  quantity: number,
  variants: CartItem['selectedVariants'],
  addons: CartItem['selectedAddons']
): number {
  const variantExtra = variants.reduce((sum, v) => sum + v.priceAdjustment, 0);
  const addonExtra = addons.reduce((sum, a) => sum + a.price, 0);
  return (menuItem.price + variantExtra + addonExtra) * quantity;
}

function isSameSelection(
  a: CartItem,
  menuItemId: string,
  variants: CartItem['selectedVariants'],
  addons: CartItem['selectedAddons']
): boolean {
  if (a.menuItem.id !== menuItemId) return false;
  if (a.selectedVariants.length !== variants.length) return false;
  if (a.selectedAddons.length !== addons.length) return false;
  const vMatch = variants.every((v) =>
    a.selectedVariants.some((av) => av.variantId === v.variantId)
  );
  const aMatch = addons.every((ad) =>
    a.selectedAddons.some((aa) => aa.addonId === ad.addonId)
  );
  return vMatch && aMatch;
}

interface PosStore {
  // Cart
  items: CartItem[];
  addItem: (
    menuItem: MenuItem,
    quantity: number,
    variants: CartItem['selectedVariants'],
    addons: CartItem['selectedAddons'],
    notes?: string
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItemNotes: (id: string, notes: string) => void;
  clearCart: () => void;

  // Order config
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  selectedTable: Table | null;
  setSelectedTable: (table: Table | null) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;

  // Variant modal
  variantModalItem: MenuItem | null;
  openVariantModal: (item: MenuItem) => void;
  closeVariantModal: () => void;

  // Computed
  getSubtotal: () => number;
  getTax: () => number;
  getServiceCharge: () => number;
  getTotal: () => number;
  getItemCount: () => number;

  // Processing
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;

  // Reset
  resetOrder: () => void;
}

const initialState = {
  items: [] as CartItem[],
  orderType: 'dine-in' as OrderType,
  selectedTable: null as Table | null,
  customerName: '',
  orderNotes: '',
  paymentMethod: 'cash' as PaymentMethod,
  variantModalItem: null as MenuItem | null,
  isProcessing: false,
};

export const usePosStore = create<PosStore>((set, get) => ({
  ...initialState,

  addItem: (menuItem, quantity, variants, addons, notes) => {
    const existing = get().items.find((item) =>
      isSameSelection(item, menuItem.id, variants, addons) && !item.notes && !notes
    );

    if (existing) {
      const newQty = existing.quantity + quantity;
      set((state) => ({
        items: state.items.map((item) =>
          item.id === existing.id
            ? {
                ...item,
                quantity: newQty,
                subtotal: calculateItemSubtotal(
                  item.menuItem,
                  newQty,
                  item.selectedVariants,
                  item.selectedAddons
                ),
              }
            : item
        ),
      }));
    } else {
      const subtotal = calculateItemSubtotal(menuItem, quantity, variants, addons);
      const newItem: CartItem = {
        id: `pos-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        menuItem,
        quantity,
        selectedVariants: variants,
        selectedAddons: addons,
        notes,
        subtotal,
      };
      set((state) => ({ items: [...state.items, newItem] }));
    }
  },

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
              subtotal: calculateItemSubtotal(
                item.menuItem,
                quantity,
                item.selectedVariants,
                item.selectedAddons
              ),
            }
          : item
      ),
    }));
  },

  updateItemNotes: (id, notes) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, notes } : item
      ),
    })),

  clearCart: () => set({ items: [] }),

  setOrderType: (type) =>
    set({
      orderType: type,
      selectedTable: type === 'takeaway' ? null : get().selectedTable,
    }),
  setSelectedTable: (table) => set({ selectedTable: table }),
  setCustomerName: (name) => set({ customerName: name }),
  setOrderNotes: (notes) => set({ orderNotes: notes }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),

  openVariantModal: (item) => set({ variantModalItem: item }),
  closeVariantModal: () => set({ variantModalItem: null }),

  getSubtotal: () => get().items.reduce((sum, item) => sum + item.subtotal, 0),
  getTax: () => get().getSubtotal() * TAX_RATE,
  getServiceCharge: () =>
    get().orderType === 'dine-in' ? get().getSubtotal() * SERVICE_CHARGE_RATE : 0,
  getTotal: () => get().getSubtotal() + get().getTax() + get().getServiceCharge(),
  getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

  setIsProcessing: (v) => set({ isProcessing: v }),

  resetOrder: () => set({ ...initialState }),
}));
