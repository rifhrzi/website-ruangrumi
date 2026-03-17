export const APP_NAME = 'Ruang Rumi';
export const APP_TAGLINE = 'Where Every Sip Tells a Story';
export const APP_DESCRIPTION = 'Premium cafe experience with artisan coffee, curated menu, and cozy ambience.';

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'Reservation', href: '/reservation' },
  { label: 'My Orders', href: '/my-orders' },
];

export const ADMIN_NAV_LINKS = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'POS / Cashier', href: '/admin/pos', icon: 'Monitor' },
  { label: 'Orders', href: '/admin/orders', icon: 'ShoppingBag' },
  { label: 'Reservations', href: '/admin/reservations', icon: 'CalendarDays' },
  { label: 'Menus', href: '/admin/menus', icon: 'UtensilsCrossed' },
  { label: 'Categories', href: '/admin/categories', icon: 'Tag' },
  { label: 'Tables', href: '/admin/tables', icon: 'Armchair' },
  { label: 'Table Layout', href: '/admin/tables/layout', icon: 'Map' },
  { label: 'Inventory', href: '/admin/inventory', icon: 'Package' },
  { label: 'Customers', href: '/admin/customers', icon: 'Users' },
  { label: 'Reports', href: '/admin/reports/orders', icon: 'BarChart3' },
  { label: 'Analytics', href: '/admin/analytics', icon: 'TrendingUp' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
];

export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00',
];

export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const RESERVATION_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'seated', label: 'Seated' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no-show', label: 'No Show' },
];

export const MENU_CATEGORIES_SLUGS = [
  'coffee', 'non-coffee', 'tea', 'pastry', 'main-course', 'dessert', 'snack',
];

export const STOCK_CATEGORIES = [
  { value: 'beans', label: 'Coffee Beans' },
  { value: 'milk', label: 'Milk & Dairy' },
  { value: 'syrup', label: 'Syrups & Sauces' },
  { value: 'tea', label: 'Tea Leaves' },
  { value: 'pastry_ingredient', label: 'Pastry Ingredients' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'beverage', label: 'Beverages' },
  { value: 'condiment', label: 'Condiments' },
  { value: 'other', label: 'Other' },
];
