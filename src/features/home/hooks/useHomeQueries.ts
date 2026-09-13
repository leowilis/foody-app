import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { SEARCH_CONFIG } from '@/features/search/search.constants';
import type { ActiveList, RecommendedResponse } from '../types';
import { useDebouncedValue } from './useDebouncedValue';

const LIST_LIMIT = 20;
const NEARBY_RANGE_KM = 1;
const RECOMMENDED_STALE_TIME = 5 * 60 * 1000;

const getNextPageParam = (
  lastPage: RecommendedResponse,
  allPages: RecommendedResponse[],
) => {
  const pagination = lastPage.data?.pagination;

  if (pagination?.page !== undefined && pagination?.totalPages !== undefined) {
    return pagination.page < pagination.totalPages
      ? pagination.page + 1
      : undefined;
  }
  const restaurantCount = lastPage.data?.restaurants?.length ?? 0;
  return restaurantCount < LIST_LIMIT ? undefined : allPages.length + 1;
};

export function useHomeQueries(activeList: ActiveList, keyword: string) {
  const debouncedKeyword = useDebouncedValue(
    keyword,
    SEARCH_CONFIG.debounceDelay,
  );
  const trimmedDebouncedKeyword = debouncedKeyword.trim();

  const recommendedQuery = useQuery({
    queryKey: ['recommended-resto'],
    queryFn: async () => {
      const res = await api.get<RecommendedResponse>('/api/resto/recommended');
      return res.data;
    },
    staleTime: RECOMMENDED_STALE_TIME,
  });

  const bestSellerQuery = useInfiniteQuery({
    queryKey: ['best-seller-resto'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get<RecommendedResponse>('/api/resto/best-seller', {
        params: {
          page: pageParam,
          limit: LIST_LIMIT,
        },
      });
      return res.data;
    },
    enabled: activeList === 'best-seller',
    initialPageParam: 1,
    getNextPageParam,
  });

  const allRestaurantsQuery = useInfiniteQuery({
    queryKey: ['all-restaurants'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get<RecommendedResponse>('/api/resto', {
        params: {
          page: pageParam,
          limit: LIST_LIMIT,
        },
      });
      return res.data;
    },
    enabled: activeList === 'all-restaurants',
    initialPageParam: 1,
    getNextPageParam,
  });

  const nearbyQuery = useInfiniteQuery({
    queryKey: ['nearby-resto', NEARBY_RANGE_KM],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get<RecommendedResponse>('/api/resto', {
        params: {
          range: NEARBY_RANGE_KM,
          limit: LIST_LIMIT,
          page: pageParam,
        },
      });
      return res.data;
    },
    enabled: activeList === 'nearby',
    initialPageParam: 1,
    getNextPageParam,
  });

  const searchQuery = useQuery({
    queryKey: ['search-resto', trimmedDebouncedKeyword],
    queryFn: async () => {
      const res = await api.get<RecommendedResponse>('/api/resto/search', {
        params: {
          q: trimmedDebouncedKeyword,
          page: 1,
          limit: LIST_LIMIT,
        },
      });
      return res.data;
    },
    enabled:
      activeList === 'search' &&
      trimmedDebouncedKeyword.length >= SEARCH_CONFIG.minQueryLength,
  });

  return {
    recommendedQuery,
    bestSellerQuery,
    allRestaurantsQuery,
    nearbyQuery,
    searchQuery,
    nearbyRangeKm: NEARBY_RANGE_KM,
  };
}
