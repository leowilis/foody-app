import { getErrorMessage, isUnauthorizedError } from '@/lib/api-helpers'
import type { ActiveList, RecommendedItem } from '../types'
import { useHomeQueries } from './useHomeQueries'

/**
 * Resolves the currently active query and derives its loading state,
 * error state, and flattened items list based on the active tab.
 */
export function useActiveListData(activeList: ActiveList, keyword: string) {
  const queries = useHomeQueries(activeList, keyword)
  const {
    recommendedQuery,
    bestSellerQuery,
    allRestaurantsQuery,
    nearbyQuery,
    searchQuery,
  } = queries

  const activeQuery = {
    recommended: recommendedQuery,
    'best-seller': bestSellerQuery,
    'all-restaurants': allRestaurantsQuery,
    nearby: nearbyQuery,
    search: searchQuery,
    discount: recommendedQuery, // unused — coming soon
    delivery: recommendedQuery,
    lunch: recommendedQuery,
  }[activeList]

  const items: RecommendedItem[] = (() => {
    switch (activeList) {
      case 'recommended':
        return recommendedQuery.data?.data?.recommendations ?? []
      case 'best-seller':
        return bestSellerQuery.data?.pages.flatMap((p) => p.data?.restaurants ?? []) ?? []
      case 'all-restaurants':
        return allRestaurantsQuery.data?.pages.flatMap((p) => p.data?.restaurants ?? []) ?? []
      case 'nearby':
        return nearbyQuery.data?.pages.flatMap((p) => p.data?.restaurants ?? []) ?? []
      case 'search':
        return searchQuery.data?.data?.restaurants ?? []
      default:
        return []
    }
  })()

  return {
    ...queries,
    items,
    isLoading: activeQuery.isLoading,
    isError: activeQuery.isError,
    errorMessage: getErrorMessage(activeQuery.error),
    shouldLogin: isUnauthorizedError(activeQuery.error),
  }
}