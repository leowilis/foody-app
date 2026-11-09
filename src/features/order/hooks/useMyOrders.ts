import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useIsAuthenticated } from '@/features/auth/hooks/useIsAuthenticated';
import {
  ORDER_API,
  ORDER_CONFIG,
  ORDER_QUERY_KEYS,
} from '../constants/order.constants';
import { MyOrdersResponseSchema } from '../schemas/orderSchemas';
import type { OrderStatus } from '../types';

interface UseMyOrdersOptions {
  readonly status?: OrderStatus;
  readonly page?: number;
}

// Fetches the authenticated user's paginated orders by status.
export function useMyOrders({
  status = 'done',
  page = ORDER_CONFIG.defaultPage,
}: UseMyOrdersOptions = {}) {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: [
      ...ORDER_QUERY_KEYS.MY_ORDERS,
      status,
      page,
      ORDER_CONFIG.defaultLimit,
    ],

    queryFn: async ({ signal }) => {
      const response = await api.get<unknown>(ORDER_API.MY_ORDERS, {
        params: {
          status,
          page,
          limit: ORDER_CONFIG.defaultLimit,
        },
        signal,
      });

      return MyOrdersResponseSchema.parse(response.data);
    },

    placeholderData: (previousData, previousQuery) => {
      const previousStatus = previousQuery?.queryKey[2];

      return previousStatus === status ? previousData : undefined;
    },

    enabled: isAuthenticated,
  });
}
