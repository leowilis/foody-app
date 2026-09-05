import type { ActiveList } from '../types';

export interface CategoryItem {
  key: ActiveList | 'nearby-nav';
  label: string;
  icon: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    key: 'all-restaurants',
    label: 'All Restaurant',
    icon: '/src/assets/category-all.svg',
  },
  {
    key: 'nearby-nav',
    label: 'Nearby',
    icon: '/src/assets/category-nearby.svg',
  },
  {
    key: 'discount',
    label: 'Discount',
    icon: '/src/assets/category-discount.svg',
  },
  {
    key: 'best-seller',
    label: 'Best Seller',
    icon: '/src/assets/category-best-seller.svg',
  },
  {
    key: 'delivery',
    label: 'Delivery',
    icon: '/src/assets/category-delivery.svg',
  },
  { key: 'lunch', label: 'Lunch', icon: '/src/assets/category-lunch.svg' },
];
