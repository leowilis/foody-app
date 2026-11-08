import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { api } from '@/lib/api';
import { clearCart } from '../cartSlice';
import { CartMutationSuccessResponseSchema } from '../schemas/cartSchema';
import {
  CART_API,
  CART_MUTATION_KEYS,
  CART_QUERY_KEY,
} from '../constants/cart.constants';
import type { CartResponse, ClearCartResponse } from '../types';

// Clears the server cart and synchronizes local cart state.
export function useClearCartMutation() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: CART_MUTATION_KEYS.CLEAR,

    mutationFn: async (): Promise<ClearCartResponse> => {
      const response = await api.delete<unknown>(CART_API.CLEAR);

      return CartMutationSuccessResponseSchema.parse(response.data);
    },

    onSuccess: () => {
      dispatch(clearCart());
      queryClient.setQueryData<CartResponse>(CART_QUERY_KEY, (currentCart) => {
        if (!currentCart) {
          return currentCart;
        }

        return {
          ...currentCart,
          data: {
            ...currentCart.data,
            cart: [],
            summary: {
              totalItems: 0,
              totalPrice: 0,
              restaurantCount: 0,
            },
          },
        };
      });
    },

    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: CART_QUERY_KEY,
      }),
  });
}
