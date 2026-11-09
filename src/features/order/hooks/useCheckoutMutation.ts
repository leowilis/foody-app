import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ORDER_API, ORDER_QUERY_KEYS } from '../constants/order.constants';
import { CheckoutOrderResponseSchema } from '../schemas/orderSchemas';
import type { CheckoutOrderPayload } from '../types';

// Creates an order and refreshes the order history.
export function useCheckoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CheckoutOrderPayload) => {
      const response = await api.post<unknown>(ORDER_API.CHECKOUT, payload);

      return CheckoutOrderResponseSchema.parse(response.data);
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ORDER_QUERY_KEYS.MY_ORDERS,
      });
    },
  });
}
