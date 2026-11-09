import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  HOME_API,
  HOME_QUERY_CONFIG,
  HOME_QUERY_KEYS,
} from '@/features/home/constants/home.constants';
import { SEARCH_CONFIG } from '@/features/search/search.constants';
import { api } from '@/lib/api';
import type {
  ActiveList,
  NearbyResponse,
  RecommendedResponse,
  SearchResponse,
} from '../types';
import { useDebouncedValue } from './useDebouncedValue';

const getNextPageParam = (
  lastPage: RecommendedResponse,
): number | undefined => {
  const pagination = lastPage.data?.pagination;

  if (!pagination) return undefined;

  return pagination.page < pagination.totalPages
    ? pagination.page + 1
    : undefined;
};

// Provides restaurant queries for the home page.
export function useHomeQueries(activeList: ActiveList, keyword: string) {
  const debouncedKeyword = useDebouncedValue(
    keyword,
    SEARCH_CONFIG.debounceDelay,
  );

  const trimmedDebouncedKeyword = debouncedKeyword.trim();

  const recommendedQuery = useQuery({
    queryKey: HOME_QUERY_KEYS.recommended,
    queryFn: async ({ signal }) => {
      const response = await api.get<RecommendedResponse>(
        HOME_API.RECOMMENDED,
        { signal },
      );

      return response.data;
    },
    staleTime: HOME_QUERY_CONFIG.recommendedStaleTime,
  });

  const bestSellerQuery = useInfiniteQuery({
    queryKey: HOME_QUERY_KEYS.bestSeller,
    queryFn: async ({ pageParam = 1, signal }) => {
      const response = await api.get<RecommendedResponse>(
        HOME_API.BEST_SELLER,
        {
          params: {
            page: pageParam,
            limit: HOME_QUERY_CONFIG.listLimit,
          },
          signal,
        },
      );

      return response.data;
    },
    enabled: activeList === 'best-seller',
    initialPageParam: 1,
    getNextPageParam,
    staleTime: HOME_QUERY_CONFIG.listStaleTime,
  });

  const allRestaurantsQuery = useInfiniteQuery({
    queryKey: HOME_QUERY_KEYS.allRestaurants,
    queryFn: async ({ pageParam = 1, signal }) => {
      const response = await api.get<RecommendedResponse>(
        HOME_API.RESTAURANTS,
        {
          params: {
            page: pageParam,
            limit: HOME_QUERY_CONFIG.listLimit,
          },
          signal,
        },
      );

      return response.data;
    },
    enabled: activeList === 'all-restaurants',
    initialPageParam: 1,
    getNextPageParam,
    staleTime: HOME_QUERY_CONFIG.listStaleTime,
  });

  const nearbyQuery = useQuery({
    queryKey: HOME_QUERY_KEYS.nearby(HOME_QUERY_CONFIG.nearbyRangeKm),
    queryFn: async ({ signal }) => {
      const response = await api.get<NearbyResponse>(HOME_API.NEARBY, {
        params: {
          range: HOME_QUERY_CONFIG.nearbyRangeKm,
          limit: HOME_QUERY_CONFIG.listLimit,
        },
        signal,
      });

      return response.data;
    },
    enabled: activeList === 'nearby',
    staleTime: HOME_QUERY_CONFIG.listStaleTime,
  });

  const searchQuery = useQuery({
    queryKey: HOME_QUERY_KEYS.search(trimmedDebouncedKeyword),
    queryFn: async ({ signal }) => {
      const response = await api.get<SearchResponse>(HOME_API.SEARCH, {
        params: {
          q: trimmedDebouncedKeyword,
          page: 1,
          limit: HOME_QUERY_CONFIG.listLimit,
        },
        signal,
      });

      return response.data;
    },
    enabled:
      activeList === 'search' &&
      trimmedDebouncedKeyword.length >= SEARCH_CONFIG.minQueryLength,
    staleTime: HOME_QUERY_CONFIG.searchStaleTime,
  });

  return {
    recommendedQuery,
    bestSellerQuery,
    allRestaurantsQuery,
    nearbyQuery,
    searchQuery,
    nearbyRangeKm: HOME_QUERY_CONFIG.nearbyRangeKm,
  };
}
