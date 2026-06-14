import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { ActiveList, RecommendedResponse } from '../types';
import { api } from '@/lib/api';

const LIST_LIMIT = 20;
const NEARBY_RANGE_KM = 1;

// Returns the next page number based on API pagination metadata.
const getNextPage = (
  lastPage: RecommendedResponse,
  pages: RecommendedResponse[],
) => {
  const pagination = lastPage.data?.pagination;
  if (pagination?.page && pagination?.totalPages) {
    return pagination.page < pagination.totalPages
      ? pagination.page + 1
      : undefined;
  }
  const count = lastPage.data?.restaurant?.length ?? 0;
  return count < LIST_LIMIT ? undefined : pages.length + 1;
};

/**
 * Aggregates all restaurant-related queries for the home page.
 * Each query is enabled only when its corresponding tab is active.
 */
export function useHomeQueries(activeList: ActiveList, keyword: string) {
  const recommendedQuery = useQuery({
    queryKey: ['recommended-resto'],
    queryFn: async () => {
      const res = await api.get<RecommendedResponse>('/api/resto/recommended');
      return res.data;
    },
  });

  const bestSellerQuery = useInfiniteQuery({
    queryKey: ['best-seller-resto'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get<RecommendedResponse>('/api/resto/best-seller', {
        params: { page: pageParam, limit: LIST_LIMIT },
      });
      return res.data;
    },
    enabled: activeList === 'best-seller',
    initialPageParam: 1,
    getNextPageParam: getNextPage,
  });

  const allRestaurantsQuery = useInfiniteQuery({
    queryKey: ['all-restaurants'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get<RecommendedResponse>('/api/resto', {
        params: { page: pageParam, limit: LIST_LIMIT },
      });
      return res.data;
    },
    enabled: activeList === 'all-restaurants',
    initialPageParam: 1,
    getNextPageParam: getNextPage,
  });

  const nearbyQuery = useInfiniteQuery({
    queryKey: ['nearby-resto', NEARBY_RANGE_KM],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get<RecommendedResponse>('/api/resto', {
        params: { range: NEARBY_RANGE_KM, limit: LIST_LIMIT, page: pageParam },
      });
      return res.data;
    },
    enabled: activeList === 'nearby',
    initialPageParam: 1,
    getNextPageParam: getNextPage,
  });

  const searchQuery = useQuery({
    queryKey: ['search-resto', keyword],
    queryFn: async () => {
      const res = await api.get<RecommendedResponse>('/api/resto/search', {
        params: { q: keyword.trim(), page: 1, limit: LIST_LIMIT },
      });
      return res.data;
    },
    enabled: activeList === 'search' && keyword.trim().length > 0,
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
