import { MenuCategory, MenuItem } from '@/lib/types';

export const menuCategories: MenuCategory[] = [
  { id: 'cat-1', name: 'Coffee', slug: 'coffee', description: 'Artisan coffee crafted with premium beans', order: 1, isActive: true },
  { id: 'cat-2', name: 'Non-Coffee', slug: 'non-coffee', description: 'Refreshing beverages without caffeine', order: 2, isActive: true },
  { id: 'cat-3', name: 'Tea', slug: 'tea', description: 'Premium tea selections from around the world', order: 3, isActive: true },
  { id: 'cat-4', name: 'Pastry', slug: 'pastry', description: 'Freshly baked pastries and bread', order: 4, isActive: true },
  { id: 'cat-5', name: 'Main Course', slug: 'main-course', description: 'Hearty meals for every appetite', order: 5, isActive: true },
  { id: 'cat-6', name: 'Dessert', slug: 'dessert', description: 'Sweet endings to your meal', order: 6, isActive: true },
  { id: 'cat-7', name: 'Snack', slug: 'snack', description: 'Light bites and finger food', order: 7, isActive: true },
];

export const menuItems: MenuItem[] = [
  // Coffee
  {
    id: 'menu-1', categoryId: 'cat-1', name: 'Rumi Signature Latte', slug: 'rumi-signature-latte',
    description: 'Our signature house blend espresso with velvety steamed milk and a hint of vanilla caramel.',
    image: '/images/menu/latte.jpg', price: 38000, isAvailable: true, isBestSeller: true,
    rating: 4.9, totalOrders: 1250,
    variants: [
      { id: 'v1', menuItemId: 'menu-1', name: 'Hot', type: 'temperature', priceAdjustment: 0, isDefault: true },
      { id: 'v2', menuItemId: 'menu-1', name: 'Iced', type: 'temperature', priceAdjustment: 3000 },
      { id: 'v3', menuItemId: 'menu-1', name: 'Regular', type: 'size', priceAdjustment: 0, isDefault: true },
      { id: 'v4', menuItemId: 'menu-1', name: 'Large', type: 'size', priceAdjustment: 8000 },
    ],
    addons: [
      { id: 'a1', menuItemId: 'menu-1', name: 'Extra Shot', price: 5000, isAvailable: true },
      { id: 'a2', menuItemId: 'menu-1', name: 'Oat Milk', price: 8000, isAvailable: true },
      { id: 'a3', menuItemId: 'menu-1', name: 'Whipped Cream', price: 5000, isAvailable: true },
    ],
  },
  {
    id: 'menu-2', categoryId: 'cat-1', name: 'Cappuccino', slug: 'cappuccino',
    description: 'Classic Italian cappuccino with rich espresso and thick foam crown.',
    image: '/images/menu/cappuccino.jpg', price: 35000, isAvailable: true, isBestSeller: false,
    rating: 4.7, totalOrders: 890,
    variants: [
      { id: 'v5', menuItemId: 'menu-2', name: 'Hot', type: 'temperature', priceAdjustment: 0, isDefault: true },
      { id: 'v6', menuItemId: 'menu-2', name: 'Iced', type: 'temperature', priceAdjustment: 3000 },
    ],
    addons: [
      { id: 'a4', menuItemId: 'menu-2', name: 'Extra Shot', price: 5000, isAvailable: true },
      { id: 'a5', menuItemId: 'menu-2', name: 'Vanilla Syrup', price: 5000, isAvailable: true },
    ],
  },
  {
    id: 'menu-3', categoryId: 'cat-1', name: 'Espresso', slug: 'espresso',
    description: 'Double shot of our premium single origin beans. Bold and aromatic.',
    image: '/images/menu/espresso.jpg', price: 25000, isAvailable: true, isBestSeller: false,
    rating: 4.8, totalOrders: 650,
    variants: [
      { id: 'v7', menuItemId: 'menu-3', name: 'Single', type: 'size', priceAdjustment: -5000 },
      { id: 'v8', menuItemId: 'menu-3', name: 'Double', type: 'size', priceAdjustment: 0, isDefault: true },
    ],
    addons: [],
  },
  {
    id: 'menu-4', categoryId: 'cat-1', name: 'Caramel Macchiato', slug: 'caramel-macchiato',
    description: 'Espresso layered with vanilla-flavored steamed milk and caramel drizzle.',
    image: '/images/menu/macchiato.jpg', price: 42000, isAvailable: true, isBestSeller: true,
    rating: 4.8, totalOrders: 1100,
    variants: [
      { id: 'v9', menuItemId: 'menu-4', name: 'Hot', type: 'temperature', priceAdjustment: 0, isDefault: true },
      { id: 'v10', menuItemId: 'menu-4', name: 'Iced', type: 'temperature', priceAdjustment: 3000 },
      { id: 'v11', menuItemId: 'menu-4', name: 'Regular', type: 'size', priceAdjustment: 0, isDefault: true },
      { id: 'v12', menuItemId: 'menu-4', name: 'Large', type: 'size', priceAdjustment: 8000 },
    ],
    addons: [
      { id: 'a6', menuItemId: 'menu-4', name: 'Extra Caramel', price: 3000, isAvailable: true },
      { id: 'a7', menuItemId: 'menu-4', name: 'Whipped Cream', price: 5000, isAvailable: true },
    ],
  },
  {
    id: 'menu-5', categoryId: 'cat-1', name: 'Affogato', slug: 'affogato',
    description: 'A scoop of creamy vanilla gelato drowned in a shot of hot espresso.',
    image: '/images/menu/affogato.jpg', price: 40000, isAvailable: true, isBestSeller: false,
    rating: 4.6, totalOrders: 420, variants: [], addons: [],
  },
  {
    id: 'menu-6', categoryId: 'cat-1', name: 'Mocha', slug: 'mocha',
    description: 'Rich espresso meets premium Belgian chocolate with steamed milk.',
    image: '/images/menu/mocha.jpg', price: 40000, isAvailable: true, isBestSeller: false,
    rating: 4.7, totalOrders: 780,
    variants: [
      { id: 'v13', menuItemId: 'menu-6', name: 'Hot', type: 'temperature', priceAdjustment: 0, isDefault: true },
      { id: 'v14', menuItemId: 'menu-6', name: 'Iced', type: 'temperature', priceAdjustment: 3000 },
    ],
    addons: [
      { id: 'a8', menuItemId: 'menu-6', name: 'Extra Chocolate', price: 5000, isAvailable: true },
    ],
  },
  // Non-Coffee
  {
    id: 'menu-7', categoryId: 'cat-2', name: 'Mango Passion Smoothie', slug: 'mango-passion-smoothie',
    description: 'Tropical blend of fresh mango and passion fruit with yogurt.',
    image: '/images/menu/mango-smoothie.jpg', price: 38000, isAvailable: true, isBestSeller: true,
    rating: 4.8, totalOrders: 950, variants: [], addons: [],
  },
  {
    id: 'menu-8', categoryId: 'cat-2', name: 'Chocolate Frappe', slug: 'chocolate-frappe',
    description: 'Blended Belgian chocolate with ice cream and whipped cream.',
    image: '/images/menu/choco-frappe.jpg', price: 42000, isAvailable: true, isBestSeller: false,
    rating: 4.6, totalOrders: 670, variants: [], addons: [],
  },
  {
    id: 'menu-9', categoryId: 'cat-2', name: 'Berry Lemonade', slug: 'berry-lemonade',
    description: 'Fresh lemonade with mixed berries and a hint of mint.',
    image: '/images/menu/berry-lemonade.jpg', price: 32000, isAvailable: true, isBestSeller: false,
    rating: 4.5, totalOrders: 530, variants: [], addons: [],
  },
  // Tea
  {
    id: 'menu-10', categoryId: 'cat-3', name: 'Matcha Latte', slug: 'matcha-latte',
    description: 'Ceremonial grade matcha whisked with steamed milk.',
    image: '/images/menu/matcha.jpg', price: 38000, isAvailable: true, isBestSeller: true,
    rating: 4.8, totalOrders: 870,
    variants: [
      { id: 'v15', menuItemId: 'menu-10', name: 'Hot', type: 'temperature', priceAdjustment: 0, isDefault: true },
      { id: 'v16', menuItemId: 'menu-10', name: 'Iced', type: 'temperature', priceAdjustment: 3000 },
    ],
    addons: [
      { id: 'a9', menuItemId: 'menu-10', name: 'Oat Milk', price: 8000, isAvailable: true },
    ],
  },
  {
    id: 'menu-11', categoryId: 'cat-3', name: 'Earl Grey', slug: 'earl-grey',
    description: 'Classic bergamot-infused black tea, smooth and aromatic.',
    image: '/images/menu/earl-grey.jpg', price: 28000, isAvailable: true, isBestSeller: false,
    rating: 4.5, totalOrders: 320, variants: [], addons: [],
  },
  {
    id: 'menu-12', categoryId: 'cat-3', name: 'Chamomile Honey', slug: 'chamomile-honey',
    description: 'Soothing chamomile tea with raw honey and a lemon wedge.',
    image: '/images/menu/chamomile.jpg', price: 30000, isAvailable: true, isBestSeller: false,
    rating: 4.4, totalOrders: 280, variants: [], addons: [],
  },
  // Pastry
  {
    id: 'menu-13', categoryId: 'cat-4', name: 'Butter Croissant', slug: 'butter-croissant',
    description: 'Flaky, buttery French croissant baked fresh every morning.',
    image: '/images/menu/croissant.jpg', price: 28000, isAvailable: true, isBestSeller: true,
    rating: 4.9, totalOrders: 1420, variants: [], addons: [],
  },
  {
    id: 'menu-14', categoryId: 'cat-4', name: 'Almond Danish', slug: 'almond-danish',
    description: 'Golden pastry filled with almond cream and topped with sliced almonds.',
    image: '/images/menu/danish.jpg', price: 32000, isAvailable: true, isBestSeller: false,
    rating: 4.6, totalOrders: 560, variants: [], addons: [],
  },
  {
    id: 'menu-15', categoryId: 'cat-4', name: 'Cinnamon Roll', slug: 'cinnamon-roll',
    description: 'Soft, warm cinnamon roll with cream cheese frosting.',
    image: '/images/menu/cinnamon-roll.jpg', price: 30000, isAvailable: true, isBestSeller: false,
    rating: 4.7, totalOrders: 680, variants: [], addons: [],
  },
  // Main Course
  {
    id: 'menu-16', categoryId: 'cat-5', name: 'Truffle Mushroom Pasta', slug: 'truffle-mushroom-pasta',
    description: 'Creamy fettuccine with sauteed mushrooms and truffle oil.',
    image: '/images/menu/pasta.jpg', price: 68000, isAvailable: true, isBestSeller: true,
    rating: 4.8, totalOrders: 790, variants: [], addons: [],
  },
  {
    id: 'menu-17', categoryId: 'cat-5', name: 'Grilled Chicken Sandwich', slug: 'grilled-chicken-sandwich',
    description: 'Herb-marinated grilled chicken with avocado, arugula on sourdough.',
    image: '/images/menu/sandwich.jpg', price: 55000, isAvailable: true, isBestSeller: false,
    rating: 4.6, totalOrders: 480, variants: [], addons: [],
  },
  {
    id: 'menu-18', categoryId: 'cat-5', name: 'Beef Rice Bowl', slug: 'beef-rice-bowl',
    description: 'Tender sliced beef with teriyaki glaze over Japanese rice.',
    image: '/images/menu/rice-bowl.jpg', price: 62000, isAvailable: true, isBestSeller: false,
    rating: 4.7, totalOrders: 610, variants: [], addons: [],
  },
  // Dessert
  {
    id: 'menu-19', categoryId: 'cat-6', name: 'Tiramisu', slug: 'tiramisu',
    description: 'Classic Italian dessert with layers of espresso-soaked ladyfingers and mascarpone.',
    image: '/images/menu/tiramisu.jpg', price: 45000, isAvailable: true, isBestSeller: true,
    rating: 4.9, totalOrders: 930, variants: [], addons: [],
  },
  {
    id: 'menu-20', categoryId: 'cat-6', name: 'Burnt Cheesecake', slug: 'burnt-cheesecake',
    description: 'Creamy Basque-style burnt cheesecake with berry compote.',
    image: '/images/menu/cheesecake.jpg', price: 42000, isAvailable: true, isBestSeller: false,
    rating: 4.8, totalOrders: 720, variants: [], addons: [],
  },
  // Snack
  {
    id: 'menu-21', categoryId: 'cat-7', name: 'Truffle Fries', slug: 'truffle-fries',
    description: 'Crispy golden fries with truffle oil, parmesan, and herbs.',
    image: '/images/menu/fries.jpg', price: 35000, isAvailable: true, isBestSeller: false,
    rating: 4.7, totalOrders: 850, variants: [], addons: [],
  },
  {
    id: 'menu-22', categoryId: 'cat-7', name: 'Nachos Grande', slug: 'nachos-grande',
    description: 'Loaded nachos with cheese sauce, salsa, sour cream, and jalapeños.',
    image: '/images/menu/nachos.jpg', price: 42000, isAvailable: false, isBestSeller: false,
    rating: 4.5, totalOrders: 390, variants: [], addons: [],
  },
];
