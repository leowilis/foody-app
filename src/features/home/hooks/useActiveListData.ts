import { getErrorMessage, isUnauthorizedError } from '@/lib/api-helpers';

import type { ActiveList, RecommendedItem } from '../types';

import { useHomeQueries } from './useHomeQueries';

// Selects the active restaurant data and query state.
export function useActiveListData(activeList: ActiveList, keyword: string) {
  const {
    recommendedQuery,
    bestSellerQuery,
    allRestaurantsQuery,
    nearbyQuery,
    searchQuery,
    nearbyRangeKm,
  } = useHomeQueries(activeList, keyword);

  const activeQuery = {
    recommended: recommendedQuery,
    'best-seller': bestSellerQuery,
    'all-restaurants': allRestaurantsQuery,
    nearby: nearbyQuery,
    search: searchQuery,
    discount: recommendedQuery,
    delivery: recommendedQuery,
    lunch: recommendedQuery,
  }[activeList];

  const items: RecommendedItem[] = (() => {
    switch (activeList) {
      case 'recommended':
      case 'discount':
      case 'delivery':
      case 'lunch':
        return recommendedQuery.data?.data?.recommendations ?? [];

      case 'best-seller':
        return (
          bestSellerQuery.data?.pages.flatMap(
            (page) => page.data?.restaurants ?? [],
          ) ?? []
        );

      case 'all-restaurants':
        return (
          allRestaurantsQuery.data?.pages.flatMap(
            (page) => page.data?.restaurants ?? [],
          ) ?? []
        );

      case 'nearby':
        return (
          nearbyQuery.data?.pages.flatMap(
            (page) => page.data?.restaurants ?? [],
          ) ?? []
        );

      case 'search':
        return searchQuery.data?.data?.restaurants ?? [];

      default:
        return [];
    }
  })();

  return {
    items,
    isLoading: activeQuery.isLoading,
    isError: activeQuery.isError,
    errorMessage: getErrorMessage(activeQuery.error),
    shouldLogin: isUnauthorizedError(activeQuery.error),
    recommendedQuery,
    bestSellerQuery,
    allRestaurantsQuery,
    nearbyQuery,
    searchQuery,
    nearbyRangeKm,
  };
}
