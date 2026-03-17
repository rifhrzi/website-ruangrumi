import { Order, Reservation, StockItem, StockMovement, CustomerProfile, DashboardStats, RevenueData, CategorySales, TopSellingItem } from '@/lib/types';

export const mockOrders: Order[] = [
  {
    id: 'ord-1', orderCode: 'ORD-20260301', userId: 'usr-1',
    customerName: 'Aditya Pratama', customerPhone: '081234567890', customerEmail: 'aditya@email.com',
    type: 'dine-in', status: 'completed',
    items: [
      { id: 'oi-1', orderId: 'ord-1', menuItemId: 'menu-1', menuItemName: 'Rumi Signature Latte', menuItemImage: '/images/menu/latte.jpg', quantity: 2, price: 38000, variants: ['Iced', 'Large'], addons: ['Extra Shot'], subtotal: 102000 },
      { id: 'oi-2', orderId: 'ord-1', menuItemId: 'menu-13', menuItemName: 'Butter Croissant', menuItemImage: '/images/menu/croissant.jpg', quantity: 1, price: 28000, variants: [], addons: [], subtotal: 28000 },
    ],
    subtotal: 130000, tax: 14300, serviceCharge: 6500, discount: 0, total: 150800,
    paymentStatus: 'paid', paymentMethod: 'qris', tableId: 't-3', createdAt: '2026-03-13T09:30:00', updatedAt: '2026-03-13T10:15:00',
  },
  {
    id: 'ord-2', orderCode: 'ORD-20260302', userId: 'usr-2',
    customerName: 'Sarah Wijaya', customerPhone: '081298765432',
    type: 'takeaway', status: 'preparing',
    items: [
      { id: 'oi-3', orderId: 'ord-2', menuItemId: 'menu-4', menuItemName: 'Caramel Macchiato', menuItemImage: '/images/menu/macchiato.jpg', quantity: 1, price: 42000, variants: ['Iced'], addons: ['Extra Caramel'], subtotal: 48000 },
      { id: 'oi-4', orderId: 'ord-2', menuItemId: 'menu-19', menuItemName: 'Tiramisu', menuItemImage: '/images/menu/tiramisu.jpg', quantity: 1, price: 45000, variants: [], addons: [], subtotal: 45000 },
    ],
    subtotal: 93000, tax: 10230, serviceCharge: 0, discount: 0, total: 103230,
    paymentStatus: 'paid', paymentMethod: 'e-wallet', createdAt: '2026-03-13T11:00:00', updatedAt: '2026-03-13T11:05:00',
  },
  {
    id: 'ord-3', orderCode: 'ORD-20260303',
    customerName: 'Budi Santoso', customerPhone: '081377889900',
    type: 'dine-in', status: 'pending',
    items: [
      { id: 'oi-5', orderId: 'ord-3', menuItemId: 'menu-16', menuItemName: 'Truffle Mushroom Pasta', menuItemImage: '/images/menu/pasta.jpg', quantity: 2, price: 68000, variants: [], addons: [], subtotal: 136000 },
      { id: 'oi-6', orderId: 'ord-3', menuItemId: 'menu-7', menuItemName: 'Mango Passion Smoothie', menuItemImage: '/images/menu/mango-smoothie.jpg', quantity: 2, price: 38000, variants: [], addons: [], subtotal: 76000 },
    ],
    subtotal: 212000, tax: 23320, serviceCharge: 10600, discount: 0, total: 245920,
    paymentStatus: 'unpaid', tableId: 't-6', createdAt: '2026-03-13T12:30:00', updatedAt: '2026-03-13T12:30:00',
  },
  {
    id: 'ord-4', orderCode: 'ORD-20260304', userId: 'usr-3',
    customerName: 'Rina Kartika', customerPhone: '081455667788',
    type: 'dine-in', status: 'ready',
    items: [
      { id: 'oi-7', orderId: 'ord-4', menuItemId: 'menu-10', menuItemName: 'Matcha Latte', menuItemImage: '/images/menu/matcha.jpg', quantity: 1, price: 38000, variants: ['Iced'], addons: ['Oat Milk'], subtotal: 49000 },
    ],
    subtotal: 49000, tax: 5390, serviceCharge: 2450, discount: 0, total: 56840,
    paymentStatus: 'paid', paymentMethod: 'cash', tableId: 't-1', createdAt: '2026-03-13T13:00:00', updatedAt: '2026-03-13T13:20:00',
  },
  {
    id: 'ord-5', orderCode: 'ORD-20260305',
    customerName: 'Dimas Wicaksono', customerPhone: '081566778899',
    type: 'takeaway', status: 'confirmed',
    items: [
      { id: 'oi-8', orderId: 'ord-5', menuItemId: 'menu-2', menuItemName: 'Cappuccino', menuItemImage: '/images/menu/cappuccino.jpg', quantity: 3, price: 35000, variants: ['Hot'], addons: [], subtotal: 105000 },
      { id: 'oi-9', orderId: 'ord-5', menuItemId: 'menu-15', menuItemName: 'Cinnamon Roll', menuItemImage: '/images/menu/cinnamon-roll.jpg', quantity: 3, price: 30000, variants: [], addons: [], subtotal: 90000 },
    ],
    subtotal: 195000, tax: 21450, serviceCharge: 0, discount: 15000, total: 201450,
    paymentStatus: 'paid', paymentMethod: 'transfer', createdAt: '2026-03-13T14:00:00', updatedAt: '2026-03-13T14:10:00',
  },
];

export const mockReservations: Reservation[] = [
  {
    id: 'res-1', bookingCode: 'RR-AB1234', userId: 'usr-1',
    customerName: 'Aditya Pratama', customerPhone: '081234567890', customerEmail: 'aditya@email.com',
    date: '2026-03-14', timeSlot: '12:00', endTime: '14:00', pax: 4,
    tableIds: ['t-3'], status: 'confirmed', estimatedDuration: 120,
    createdAt: '2026-03-12T09:00:00', updatedAt: '2026-03-12T10:00:00',
  },
  {
    id: 'res-2', bookingCode: 'RR-CD5678', userId: 'usr-2',
    customerName: 'Sarah Wijaya', customerPhone: '081298765432',
    date: '2026-03-14', timeSlot: '18:00', endTime: '20:00', pax: 6,
    tableIds: ['t-6'], status: 'pending', estimatedDuration: 120,
    notes: 'Birthday celebration, please prepare a cake spot',
    createdAt: '2026-03-13T08:00:00', updatedAt: '2026-03-13T08:00:00',
  },
  {
    id: 'res-3', bookingCode: 'RR-EF9012',
    customerName: 'Tommy Hadrian', customerPhone: '081699887766',
    date: '2026-03-13', timeSlot: '19:00', endTime: '21:00', pax: 8,
    tableIds: ['t-19'], status: 'seated', estimatedDuration: 120,
    notes: 'VIP client meeting',
    createdAt: '2026-03-11T14:00:00', updatedAt: '2026-03-13T19:05:00',
  },
  {
    id: 'res-4', bookingCode: 'RR-GH3456',
    customerName: 'Lisa Anggraini', customerPhone: '081788776655',
    date: '2026-03-15', timeSlot: '11:00', endTime: '12:30', pax: 2,
    tableIds: ['t-1'], status: 'confirmed', estimatedDuration: 90,
    createdAt: '2026-03-13T10:00:00', updatedAt: '2026-03-13T10:30:00',
  },
];

export const mockStockItems: StockItem[] = [
  { id: 'stk-1', name: 'Arabica Coffee Beans', sku: 'BN-001', category: 'beans', unit: 'kg', currentStock: 15, minimumStock: 10, price: 180000, isLowStock: false, lastRestocked: '2026-03-10', updatedAt: '2026-03-13' },
  { id: 'stk-2', name: 'Robusta Coffee Beans', sku: 'BN-002', category: 'beans', unit: 'kg', currentStock: 8, minimumStock: 10, price: 120000, isLowStock: true, lastRestocked: '2026-03-05', updatedAt: '2026-03-13' },
  { id: 'stk-3', name: 'Fresh Milk', sku: 'ML-001', category: 'milk', unit: 'liter', currentStock: 25, minimumStock: 20, price: 28000, isLowStock: false, lastRestocked: '2026-03-12', updatedAt: '2026-03-13' },
  { id: 'stk-4', name: 'Oat Milk', sku: 'ML-002', category: 'milk', unit: 'liter', currentStock: 5, minimumStock: 8, price: 65000, isLowStock: true, lastRestocked: '2026-03-08', updatedAt: '2026-03-13' },
  { id: 'stk-5', name: 'Vanilla Syrup', sku: 'SY-001', category: 'syrup', unit: 'bottle', currentStock: 12, minimumStock: 5, price: 85000, isLowStock: false, lastRestocked: '2026-03-09', updatedAt: '2026-03-13' },
  { id: 'stk-6', name: 'Caramel Syrup', sku: 'SY-002', category: 'syrup', unit: 'bottle', currentStock: 3, minimumStock: 5, price: 85000, isLowStock: true, lastRestocked: '2026-03-01', updatedAt: '2026-03-13' },
  { id: 'stk-7', name: 'Matcha Powder', sku: 'TE-001', category: 'tea', unit: 'gram', currentStock: 500, minimumStock: 300, price: 150000, isLowStock: false, lastRestocked: '2026-03-07', updatedAt: '2026-03-13' },
  { id: 'stk-8', name: 'Paper Cups 12oz', sku: 'PK-001', category: 'packaging', unit: 'pcs', currentStock: 200, minimumStock: 100, price: 1500, isLowStock: false, lastRestocked: '2026-03-11', updatedAt: '2026-03-13' },
  { id: 'stk-9', name: 'Butter', sku: 'PI-001', category: 'pastry_ingredient', unit: 'kg', currentStock: 4, minimumStock: 5, price: 95000, isLowStock: true, lastRestocked: '2026-03-06', updatedAt: '2026-03-13' },
  { id: 'stk-10', name: 'Belgian Chocolate', sku: 'PI-002', category: 'pastry_ingredient', unit: 'kg', currentStock: 6, minimumStock: 3, price: 220000, isLowStock: false, lastRestocked: '2026-03-10', updatedAt: '2026-03-13' },
];

export const mockStockMovements: StockMovement[] = [
  { id: 'sm-1', stockItemId: 'stk-1', type: 'in', quantity: 10, previousStock: 5, newStock: 15, notes: 'Monthly restock', createdBy: 'Admin', createdAt: '2026-03-10T08:00:00' },
  { id: 'sm-2', stockItemId: 'stk-3', type: 'in', quantity: 20, previousStock: 5, newStock: 25, notes: 'Weekly delivery', createdBy: 'Admin', createdAt: '2026-03-12T07:00:00' },
  { id: 'sm-3', stockItemId: 'stk-2', type: 'out', quantity: 2, previousStock: 10, newStock: 8, notes: 'Daily usage', createdBy: 'System', createdAt: '2026-03-13T06:00:00' },
  { id: 'sm-4', stockItemId: 'stk-6', type: 'out', quantity: 1, previousStock: 4, newStock: 3, notes: 'Daily usage', createdBy: 'System', createdAt: '2026-03-13T06:00:00' },
  { id: 'sm-5', stockItemId: 'stk-9', type: 'waste', quantity: 1, previousStock: 5, newStock: 4, notes: 'Expired batch', createdBy: 'Admin', createdAt: '2026-03-12T16:00:00' },
];

export const mockCustomers: CustomerProfile[] = [
  { id: 'cp-1', userId: 'usr-1', totalOrders: 45, totalSpending: 4250000, segment: 'loyal', lastOrderAt: '2026-03-13T09:30:00' },
  { id: 'cp-2', userId: 'usr-2', totalOrders: 22, totalSpending: 1890000, segment: 'regular', lastOrderAt: '2026-03-13T11:00:00' },
  { id: 'cp-3', userId: 'usr-3', totalOrders: 8, totalSpending: 560000, segment: 'regular', lastOrderAt: '2026-03-13T13:00:00' },
  { id: 'cp-4', userId: 'usr-4', totalOrders: 2, totalSpending: 156000, segment: 'new', lastOrderAt: '2026-03-10T15:00:00' },
  { id: 'cp-5', userId: 'usr-5', totalOrders: 35, totalSpending: 3100000, segment: 'loyal', lastOrderAt: '2026-03-08T12:00:00' },
];

export const mockDashboardStats: DashboardStats = {
  todayOrders: 47,
  todayRevenue: 8450000,
  todayReservations: 12,
  tablesOccupied: 8,
  totalTables: 23,
  activeMenuItems: 21,
  lowStockItems: 4,
};

export const mockRevenueData: RevenueData[] = [
  { date: '2026-03-07', revenue: 7200000, orders: 38 },
  { date: '2026-03-08', revenue: 9100000, orders: 52 },
  { date: '2026-03-09', revenue: 10500000, orders: 58 },
  { date: '2026-03-10', revenue: 8800000, orders: 45 },
  { date: '2026-03-11', revenue: 7600000, orders: 41 },
  { date: '2026-03-12', revenue: 9400000, orders: 50 },
  { date: '2026-03-13', revenue: 8450000, orders: 47 },
];

export const mockCategorySales: CategorySales[] = [
  { category: 'Coffee', total: 3200000, percentage: 38 },
  { category: 'Non-Coffee', total: 1100000, percentage: 13 },
  { category: 'Tea', total: 850000, percentage: 10 },
  { category: 'Pastry', total: 1200000, percentage: 14 },
  { category: 'Main Course', total: 980000, percentage: 12 },
  { category: 'Dessert', total: 680000, percentage: 8 },
  { category: 'Snack', total: 440000, percentage: 5 },
];

export const mockTopSelling: TopSellingItem[] = [
  { menuItemId: 'menu-13', name: 'Butter Croissant', image: '/images/menu/croissant.jpg', totalOrders: 1420, totalRevenue: 39760000 },
  { menuItemId: 'menu-1', name: 'Rumi Signature Latte', image: '/images/menu/latte.jpg', totalOrders: 1250, totalRevenue: 47500000 },
  { menuItemId: 'menu-4', name: 'Caramel Macchiato', image: '/images/menu/macchiato.jpg', totalOrders: 1100, totalRevenue: 46200000 },
  { menuItemId: 'menu-7', name: 'Mango Passion Smoothie', image: '/images/menu/mango-smoothie.jpg', totalOrders: 950, totalRevenue: 36100000 },
  { menuItemId: 'menu-19', name: 'Tiramisu', image: '/images/menu/tiramisu.jpg', totalOrders: 930, totalRevenue: 41850000 },
];
