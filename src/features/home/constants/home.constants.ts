export const HOME_API = {
  RECOMMENDED: '/api/resto/recommended',
  BEST_SELLER: '/api/resto/best-seller',
  RESTAURANTS: '/api/resto',
  NEARBY: '/api/resto/nearby',
  SEARCH: '/api/resto/search',
} as const;

export const HOME_QUERY_CONFIG = {
  listLimit: 20,
  nearbyRangeKm: 1,
  recommendedStaleTime: 5 * 60 * 1000,
  searchStaleTime: 60 * 1000,
  listStaleTime: 60 * 1000,
} as const;

// React Query keys used by restaurant discovery queries.
export const HOME_QUERY_KEYS = {
  recommended: ['recommended-resto'] as const,
  bestSeller: ['best-seller-resto'] as const,
  allRestaurants: ['all-restaurants'] as const,
  nearby: (rangeKm: number) => ['nearby-resto', rangeKm] as const,
  search: (keyword: string) => ['search-resto', keyword] as const,
} as const;
