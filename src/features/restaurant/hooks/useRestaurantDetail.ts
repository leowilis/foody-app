import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/api-helpers';
import type { DetailResponse } from '../type';

// Fetches restaurant detail including menus and reviews with pagination.
export function useRestaurantDetail(
  id: string | undefined,
  menuLimit: number,
  reviewLimit: number,
) {
  const query = useQuery({
    queryKey: ['restaurant-detail', id, menuLimit, reviewLimit],
    queryFn: async () => {
      const res = await api.get<DetailResponse>(`/api/resto/${id}`, {
        params: { limitMenu: menuLimit, limitReview: reviewLimit },
      });
      return res.data;
    },
    enabled: Boolean(id),
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
    detail: query.data?.data,
    errorMessage: getErrorMessage(query.error),
  };
}
