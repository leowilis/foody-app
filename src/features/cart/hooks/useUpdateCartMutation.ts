import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { store } from '@/app/store';
import { api } from '@/lib/api';
import { setCartItemId, updateQuantity } from '../cartSlice';
import {
  CART_API,
  CART_MESSAGES,
  CART_MUTATION_KEYS,
  CART_QUERY_KEY,
} from '../constants/cart.constants';
import type {
  CartResponse,
  UpdateCartPayload,
  UpdateCartResponse,
} from '../types';
import { updateCartCache } from '../utils/cart.utils';

/**
 * Updates a cart item's quantity and keeps local state
 * synchronized with the server response.
 */
export function useUpdateCartMutation() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: CART_MUTATION_KEYS.UPDATE,

    mutationFn: async (
      payload: UpdateCartPayload,
    ): Promise<UpdateCartResponse> => {
      const response = await api.put<UpdateCartResponse>(
        CART_API.ITEM(payload.cartItemId),
        {
          quantity: payload.quantity,
        },
      );

      return response.data;
    },

    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: CART_QUERY_KEY,
      });

      const previousItem = store
        .getState()
        .cart.items.find((item) => item.menuId === payload.menuId);

      const previousCart =
        queryClient.getQueryData<CartResponse>(CART_QUERY_KEY);

      const previousCacheQuantity = previousCart?.data?.cart
        ?.flatMap((group) => group.items)
        .find((item) => item.id === payload.cartItemId)?.quantity;

      queryClient.setQueryData<CartResponse>(CART_QUERY_KEY, (currentCart) =>
        updateCartCache(currentCart, {
          cartItemId: payload.cartItemId,
          quantity: payload.quantity,
        }),
      );

      dispatch(
        updateQuantity({
          menuId: payload.menuId,
          qty: payload.quantity,
        }),
      );

      return {
        menuId: payload.menuId,
        previousQuantity: previousItem?.qty,
        previousCacheQuantity,
      };
    },

    onError: (_error, payload, context) => {
      if (context?.previousQuantity !== undefined) {
        dispatch(
          updateQuantity({
            menuId: context.menuId,
            qty: context.previousQuantity,
          }),
        );
      }

      const previousCacheQuantity = context?.previousCacheQuantity;

      if (previousCacheQuantity !== undefined) {
        queryClient.setQueryData<CartResponse>(CART_QUERY_KEY, (currentCart) =>
          updateCartCache(currentCart, {
            cartItemId: payload.cartItemId,
            quantity: previousCacheQuantity,
          }),
        );
      }

      toast.error(CART_MESSAGES.UPDATE_ERROR);
    },

    onSuccess: (data, payload) => {
      const cartItem = data.data?.cartItem;

      if (cartItem) {
        dispatch(
          setCartItemId({
            menuId: payload.menuId,
            cartItemId: cartItem.id,
          }),
        );

        dispatch(
          updateQuantity({
            menuId: payload.menuId,
            qty: cartItem.quantity,
          }),
        );
      }

      toast.success(CART_MESSAGES.UPDATE_SUCCESS);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: CART_QUERY_KEY,
      });
    },
  });
}
