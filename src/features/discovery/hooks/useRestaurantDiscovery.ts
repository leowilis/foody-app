import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  DISCOVERY_API,
  DISCOVERY_CONFIG,
  DISCOVERY_QUERY_KEYS,
} from '@/features/discovery/constants/discovery.constants';
import { api } from '@/lib/api';
import type {
  RestaurantDiscoveryFilters,
  RestaurantDiscoveryResponse,
} from '../types';

interface UseRestaurantDiscoveryOptions {
  readonly page?: number;
  readonly filters?: RestaurantDiscoveryFilters;
}

// Fetches paginated restaurants using the active discovery filters.
export function useRestaurantDiscovery({
  page = DISCOVERY_CONFIG.defaultPage,
  filters = {},
}: UseRestaurantDiscoveryOptions = {}) {
  const query = useQuery({
    queryKey: DISCOVERY_QUERY_KEYS.restaurants(filters, page),
    queryFn: async ({ signal }): Promise<RestaurantDiscoveryResponse> => {
      const params = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== undefined && value !== '',
        ),
      );

      const response = await api.get<RestaurantDiscoveryResponse>(
        DISCOVERY_API.RESTAURANTS,
        {
          params: {
            ...params,
            page,
            limit: DISCOVERY_CONFIG.defaultLimit,
          },
          signal,
        },
      );
      const result = response.data;

      if (!result.success) {
        throw new Error('Failed to load restaurants.');
      }

      return result;
    },
    placeholderData: keepPreviousData,
    staleTime: DISCOVERY_CONFIG.staleTime,
  });
  return query;
}
