export type RecomendedItem = {
  id: number;
  name: string;
  star: number;
  place: string;
  logo: string;
  images: string[];
  category: string;
  reviewCount: number;
  isFrequentlyOrdered: boolean;
};

export type RecommendedResponse = {
  success: boolean;
  message: string;
  data?: {
    recommendations?: RecomendedItem[];
    restaurant?: RecomendedItem[];
    pagination?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    };
  };
};

export type ActiveList =
  | 'recommended'
  | 'best-seller'
  | 'all-restaurants'
  | 'nearby'
  | 'discount'
  | 'delivery'
  | 'lunch'
  | 'search';

export const COMING_SOON_LISTS: ActiveList[] = [
  'discount',
  'delivery',
  'lunch',
];
