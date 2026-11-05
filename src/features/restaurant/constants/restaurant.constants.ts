import detailsDummy1 from '@/assets/details-dummy-1.svg';
import detailsDummy2 from '@/assets/details-dummy-2.svg';
import detailsDummy3 from '@/assets/details-dummy-3.svg';
import detailsDummy4 from '@/assets/details-dummy-4.svg';

export const RESTAURANT_API = {
  DETAIL: (restaurantId: string | undefined) =>
    `/api/resto/${restaurantId ?? ''}`,
} as const;

export const RESTAURANT_QUERY_KEYS = {
  DETAIL: 'restaurant-detail',
} as const;

export const RESTAURANT_IMAGE_FALLBACKS = [
  detailsDummy1,
  detailsDummy2,
  detailsDummy3,
  detailsDummy4,
] as const;
