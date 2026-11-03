import {
  getErrorMessage,
  isLocationNotSetError,
  isUnauthorizedError,
} from '@/lib/api-helpers';
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
  }[activeList];

  const items: readonly RecommendedItem[] = (() => {
    switch (activeList) {
      case 'recommended':
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
        return nearbyQuery.data?.data?.restaurants ?? [];

      case 'search':
        return searchQuery.data?.data?.restaurants ?? [];

      default:
        return [];
    }
  })();

  const isLocationUnavailable =
    activeList === 'nearby' && isLocationNotSetError(activeQuery.error);

  return {
    items,
    isLoading: activeQuery.isLoading,
    isError:
      activeQuery.isError && items.length === 0 && !isLocationUnavailable,
    errorMessage: getErrorMessage(activeQuery.error),
    shouldLogin: isUnauthorizedError(activeQuery.error),
    isLocationUnavailable,
    recommendedQuery,
    bestSellerQuery,
    allRestaurantsQuery,
    nearbyQuery,
    searchQuery,
    nearbyRangeKm,
  };
}
