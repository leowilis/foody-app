import type { RestaurantDiscoveryFilters } from '../types';

export const DISCOVERY_API = {
  RESTAURANTS: '/api/resto',
} as const;

export const DISCOVERY_CONFIG = {
  defaultPage: 1,
  defaultLimit: 20,
  staleTime: 60 * 1000,
} as const;

// React Query keys used by restaurant discovery.
export const DISCOVERY_QUERY_KEYS = {
  restaurants: (filters: RestaurantDiscoveryFilters, page: number) =>
    ['discovery', 'restaurants', filters, page] as const,
} as const;
