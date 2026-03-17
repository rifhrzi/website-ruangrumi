import { TableArea, Table } from '@/lib/types';

export const tableAreas: TableArea[] = [
  { id: 'area-1', name: 'Indoor Main', slug: 'indoor-main', description: 'Main indoor dining area with modern ambience', type: 'indoor', isActive: true, order: 1, color: '#F5F0EB' },
  { id: 'area-2', name: 'Outdoor Garden', slug: 'outdoor-garden', description: 'Beautiful garden seating with natural light', type: 'outdoor', isActive: true, order: 2, color: '#E8F5E9' },
  { id: 'area-3', name: 'VIP Lounge', slug: 'vip-lounge', description: 'Private VIP area with premium service', type: 'vip', isActive: true, order: 3, color: '#FFF8E1' },
  { id: 'area-4', name: 'Smoking Area', slug: 'smoking-area', description: 'Designated smoking area with ventilation', type: 'smoking', isActive: true, order: 4, color: '#F3E5F5' },
];

export const tables: Table[] = [
  // Indoor Main - arranged in a grid-like pattern
  { id: 't-1', areaId: 'area-1', number: 1, name: 'Table 1', capacity: 2, shape: 'round', status: 'available', isActive: true, x: 60, y: 60, width: 60, height: 60 },
  { id: 't-2', areaId: 'area-1', number: 2, name: 'Table 2', capacity: 2, shape: 'round', status: 'available', isActive: true, x: 160, y: 60, width: 60, height: 60 },
  { id: 't-3', areaId: 'area-1', number: 3, name: 'Table 3', capacity: 4, shape: 'square', status: 'available', isActive: true, x: 270, y: 50, width: 80, height: 80 },
  { id: 't-4', areaId: 'area-1', number: 4, name: 'Table 4', capacity: 4, shape: 'square', status: 'occupied', isActive: true, x: 390, y: 50, width: 80, height: 80 },
  { id: 't-5', areaId: 'area-1', number: 5, name: 'Table 5', capacity: 2, shape: 'round', status: 'available', isActive: true, x: 60, y: 170, width: 60, height: 60 },
  { id: 't-6', areaId: 'area-1', number: 6, name: 'Table 6', capacity: 6, shape: 'rectangle', status: 'available', isActive: true, x: 150, y: 160, width: 120, height: 70 },
  { id: 't-7', areaId: 'area-1', number: 7, name: 'Table 7', capacity: 4, shape: 'square', status: 'reserved', isActive: true, x: 310, y: 170, width: 80, height: 80 },
  { id: 't-8', areaId: 'area-1', number: 8, name: 'Table 8', capacity: 8, shape: 'rectangle', status: 'available', isActive: true, x: 430, y: 160, width: 140, height: 80, minimumOrder: 200000 },
  { id: 't-9', areaId: 'area-1', number: 9, name: 'Table 9', capacity: 2, shape: 'round', status: 'available', isActive: true, x: 60, y: 280, width: 60, height: 60 },
  { id: 't-10', areaId: 'area-1', number: 10, name: 'Table 10', capacity: 4, shape: 'sofa', status: 'available', isActive: true, x: 170, y: 280, width: 100, height: 70 },

  // Outdoor Garden
  { id: 't-11', areaId: 'area-2', number: 11, name: 'Garden 1', capacity: 2, shape: 'round', status: 'available', isActive: true, x: 60, y: 60, width: 60, height: 60 },
  { id: 't-12', areaId: 'area-2', number: 12, name: 'Garden 2', capacity: 4, shape: 'round', status: 'available', isActive: true, x: 170, y: 60, width: 80, height: 80 },
  { id: 't-13', areaId: 'area-2', number: 13, name: 'Garden 3', capacity: 4, shape: 'square', status: 'reserved', isActive: true, x: 300, y: 50, width: 80, height: 80 },
  { id: 't-14', areaId: 'area-2', number: 14, name: 'Garden 4', capacity: 6, shape: 'rectangle', status: 'available', isActive: true, x: 60, y: 180, width: 120, height: 70 },
  { id: 't-15', areaId: 'area-2', number: 15, name: 'Garden 5', capacity: 2, shape: 'round', status: 'available', isActive: true, x: 230, y: 190, width: 60, height: 60 },
  { id: 't-16', areaId: 'area-2', number: 16, name: 'Garden 6', capacity: 8, shape: 'rectangle', status: 'available', isActive: true, x: 330, y: 170, width: 140, height: 80, minimumOrder: 150000 },

  // VIP Lounge
  { id: 't-17', areaId: 'area-3', number: 17, name: 'VIP 1', capacity: 4, shape: 'sofa', status: 'available', isActive: true, x: 60, y: 60, width: 120, height: 80, minimumOrder: 300000 },
  { id: 't-18', areaId: 'area-3', number: 18, name: 'VIP 2', capacity: 6, shape: 'sofa', status: 'available', isActive: true, x: 230, y: 60, width: 140, height: 80, minimumOrder: 500000 },
  { id: 't-19', areaId: 'area-3', number: 19, name: 'VIP 3', capacity: 10, shape: 'rectangle', status: 'available', isActive: true, x: 100, y: 200, width: 180, height: 90, minimumOrder: 750000 },

  // Smoking Area
  { id: 't-20', areaId: 'area-4', number: 20, name: 'Smoke 1', capacity: 2, shape: 'round', status: 'available', isActive: true, x: 60, y: 60, width: 60, height: 60 },
  { id: 't-21', areaId: 'area-4', number: 21, name: 'Smoke 2', capacity: 4, shape: 'square', status: 'available', isActive: true, x: 170, y: 50, width: 80, height: 80 },
  { id: 't-22', areaId: 'area-4', number: 22, name: 'Smoke 3', capacity: 4, shape: 'square', status: 'occupied', isActive: true, x: 300, y: 50, width: 80, height: 80 },
  { id: 't-23', areaId: 'area-4', number: 23, name: 'Smoke 4', capacity: 6, shape: 'rectangle', status: 'available', isActive: true, x: 120, y: 180, width: 120, height: 70 },
];
