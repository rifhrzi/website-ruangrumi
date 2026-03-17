// User & Auth
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  user?: User;
  totalOrders: number;
  totalSpending: number;
  segment: 'new' | 'regular' | 'loyal' | 'inactive';
  lastOrderAt?: string;
}

// Menu
export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  category?: MenuCategory;
  name: string;
  slug: string;
  description: string;
  image: string;
  price: number;
  isAvailable: boolean;
  isBestSeller: boolean;
  variants?: MenuItemVariant[];
  addons?: MenuItemAddon[];
  rating?: number;
  totalOrders?: number;
}

export interface MenuItemVariant {
  id: string;
  menuItemId: string;
  name: string;
  type: 'size' | 'sugar_level' | 'ice_level' | 'temperature';
  priceAdjustment: number;
  isDefault?: boolean;
}

export interface MenuItemAddon {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

// Cart
export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedVariants: { variantId: string; name: string; type: string; priceAdjustment: number }[];
  selectedAddons: { addonId: string; name: string; price: number }[];
  notes?: string;
  subtotal: number;
}

// Order
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type OrderType = 'dine-in' | 'takeaway' | 'delivery';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type PaymentMethod = 'cash' | 'qris' | 'transfer' | 'e-wallet' | 'debit' | 'credit';

export interface Order {
  id: string;
  orderCode: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  tableId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  menuItemName: string;
  menuItemImage: string;
  quantity: number;
  price: number;
  variants: string[];
  addons: string[];
  notes?: string;
  subtotal: number;
}

// Reservation
export type ReservationStatus = 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no-show';

export interface Reservation {
  id: string;
  bookingCode: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  timeSlot: string;
  endTime: string;
  pax: number;
  tableIds: string[];
  tables?: Table[];
  status: ReservationStatus;
  notes?: string;
  estimatedDuration: number;
  createdAt: string;
  updatedAt: string;
}

// Tables
export type TableShape = 'round' | 'square' | 'rectangle' | 'sofa';
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'unavailable';

export interface TableArea {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: 'indoor' | 'outdoor' | 'vip' | 'smoking' | 'non-smoking';
  isActive: boolean;
  order: number;
  color?: string;
}

export interface Table {
  id: string;
  areaId: string;
  area?: TableArea;
  number: number;
  name: string;
  capacity: number;
  shape: TableShape;
  status: TableStatus;
  isActive: boolean;
  minimumOrder?: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

export interface TableLayout {
  id: string;
  name: string;
  areas: TableArea[];
  tables: Table[];
  width: number;
  height: number;
  updatedAt: string;
}

// Stock / Inventory
export type StockUnit = 'gram' | 'kg' | 'ml' | 'liter' | 'pcs' | 'pack' | 'bottle' | 'box';
export type StockCategory = 'beans' | 'milk' | 'syrup' | 'tea' | 'pastry_ingredient' | 'packaging' | 'beverage' | 'condiment' | 'other';
export type StockMovementType = 'in' | 'out' | 'adjustment' | 'waste';

export interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: StockCategory;
  unit: StockUnit;
  currentStock: number;
  minimumStock: number;
  price: number;
  isLowStock?: boolean;
  lastRestocked?: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  stockItemId: string;
  stockItem?: StockItem;
  type: StockMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface Recipe {
  id: string;
  menuItemId: string;
  menuItem?: MenuItem;
  ingredients: RecipeIngredient[];
}

export interface RecipeIngredient {
  stockItemId: string;
  stockItem?: StockItem;
  quantity: number;
  unit: StockUnit;
}

// Settings
export interface CafeSettings {
  id: string;
  cafeName: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  operatingHours: { day: string; open: string; close: string; isClosed: boolean }[];
  taxRate: number;
  serviceChargeRate: number;
  currency: string;
  reservationPolicy: {
    minDuration: number;
    maxDuration: number;
    maxPax: number;
    advanceBookingDays: number;
    allowTableMerge: boolean;
    autoConfirm: boolean;
  };
  paymentMethods: PaymentMethod[];
  socialMedia?: { platform: string; url: string }[];
}

// Notification
export type NotificationType = 'order' | 'reservation' | 'stock' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// Dashboard
export interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  todayReservations: number;
  tablesOccupied: number;
  totalTables: number;
  activeMenuItems: number;
  lowStockItems: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface CategorySales {
  category: string;
  total: number;
  percentage: number;
}

export interface TopSellingItem {
  menuItemId: string;
  name: string;
  image: string;
  totalOrders: number;
  totalRevenue: number;
}
