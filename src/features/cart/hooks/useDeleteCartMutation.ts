import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import type { RootState } from '@/app/store';
import { api } from '@/lib/api';
import { removeItem, upsertItem } from '../cartSlice';
import {
  CART_API,
  CART_MESSAGES,
  CART_MUTATION_KEYS,
  CART_QUERY_KEY,
} from '../constants/cart.constants';
import type {
  CartGroupItem,
  CartResponse,
  CartRestaurant,
  DeleteCartPayload,
  DeleteCartResponse,
} from '../types';
import {
  removeCartItemFromCache,
  restoreCartItemInCache,
} from '../utils/cart.utils';

type DeleteCartContext = {
  previousItem: RootState['cart']['items'][number] | undefined;
  cachedItem: CartGroupItem | undefined;
  cachedRestaurant: CartRestaurant['restaurant'] | undefined;
  cachedItemIndex: number;
};

export function useDeleteCartMutation() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  return useMutation<
    DeleteCartResponse,
    Error,
    DeleteCartPayload,
    DeleteCartContext
  >({
    mutationKey: CART_MUTATION_KEYS.DELETE,

    mutationFn: async (payload) => {
      const response = await api.delete<DeleteCartResponse>(
        CART_API.ITEM(payload.cartItemId),
      );

      return response.data;
    },

    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: CART_QUERY_KEY,
      });

      const previousItem = cartItems.find(
        (item) => item.menuId === payload.menuId,
      );

      const previousCart =
        queryClient.getQueryData<CartResponse>(CART_QUERY_KEY);

      let cachedItem: CartGroupItem | undefined;
      let cachedRestaurant: CartRestaurant['restaurant'] | undefined;
      let cachedItemIndex = 0;

      for (const group of previousCart?.data?.cart ?? []) {
        const itemIndex = group.items.findIndex(
          (item) => item.id === payload.cartItemId,
        );

        if (itemIndex === -1) continue;

        cachedItem = group.items[itemIndex];
        cachedRestaurant = group.restaurant;
        cachedItemIndex = itemIndex;
        break;
      }

      queryClient.setQueryData<CartResponse>(CART_QUERY_KEY, (currentCart) =>
        removeCartItemFromCache(currentCart, {
          cartItemId: payload.cartItemId,
        }),
      );

      dispatch(removeItem(payload.menuId));

      return {
        previousItem,
        cachedItem,
        cachedRestaurant,
        cachedItemIndex,
      };
    },

    onError: (_error, _payload, context) => {
      if (!context) return;

      if (context.previousItem) {
        dispatch(upsertItem(context.previousItem));
      }

      const { cachedItem, cachedRestaurant, cachedItemIndex } = context;

      if (cachedItem && cachedRestaurant) {
        queryClient.setQueryData<CartResponse>(CART_QUERY_KEY, (currentCart) =>
          restoreCartItemInCache(currentCart, {
            item: cachedItem,
            restaurant: cachedRestaurant,
            itemIndex: cachedItemIndex,
          }),
        );
      }

      toast.error(CART_MESSAGES.DELETE_ERROR);
    },

    onSuccess: () => {
      toast.success(CART_MESSAGES.DELETE_SUCCESS);
    },

    onSettled: () => {
      return queryClient.invalidateQueries({
        queryKey: CART_QUERY_KEY,
      });
    },
  });
}
