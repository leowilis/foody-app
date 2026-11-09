import categoryAll from '@/assets/category-all.svg';
import categoryBestSeller from '@/assets/category-best-seller.svg';
import categoryNearby from '@/assets/category-nearby.svg';
import type { ActiveList } from '../types';

export interface CategoryItem {
  readonly key: ActiveList;
  readonly label: string;
  readonly icon: string;
}

export const CATEGORIES: readonly CategoryItem[] = [
  {
    key: 'all-restaurants',
    label: 'All Restaurants',
    icon: categoryAll,
  },
  {
    key: 'nearby',
    label: 'Nearby',
    icon: categoryNearby,
  },
  {
    key: 'best-seller',
    label: 'Best Seller',
    icon: categoryBestSeller,
  },
];
