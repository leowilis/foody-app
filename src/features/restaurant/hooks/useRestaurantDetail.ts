import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/api-helpers';
import {
  RESTAURANT_API,
  RESTAURANT_QUERY_KEYS,
} from '../constants/restaurant.constants';
import {
  DetailResponseSchema,
  type DetailResponse,
} from '../schemas/restaurantSchema';

// Fetches restaurant detail with menus and reviews using pagination limits.
export function useRestaurantDetail(
  id: string | undefined,
  menuLimit: number,
  reviewLimit: number,
) {
  const query = useQuery({
    queryKey: [RESTAURANT_QUERY_KEYS.DETAIL, id, menuLimit, reviewLimit],
    queryFn: async ({ signal }): Promise<DetailResponse> => {
      const response = await api.get<DetailResponse>(
        RESTAURANT_API.DETAIL(id),
        {
          params: {
            limitMenu: menuLimit,
            limitReview: reviewLimit,
          },
          signal,
        },
      );

      return DetailResponseSchema.parse(response.data);
    },
    enabled: Boolean(id),
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryKey[1] === id ? previousData : undefined,
  });

  return {
    ...query,
    detail: query.data?.data,
    errorMessage: getErrorMessage(query.error),
  };
}
