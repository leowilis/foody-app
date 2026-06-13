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
    icon: '/images/common/category-all.svg',
  },
  {
    key: 'nearby-nav',
    label: 'Nearby',
    icon: '/images/common/category-nearby.svg',
  },
  {
    key: 'discount',
    label: 'Discount',
    icon: '/images/common/category-discount.svg',
  },
  {
    key: 'best-seller',
    label: 'Best Seller',
    icon: '/images/common/category-best-seller.svg',
  },
  {
    key: 'delivery',
    label: 'Delivery',
    icon: '/images/common/category-delivery.svg',
  },
  { key: 'lunch', label: 'Lunch', icon: '/images/common/category-lunch.svg' },
];
