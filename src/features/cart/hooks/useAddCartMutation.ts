import { useDispatch, useStore } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import type { RootState } from '@/app/store';
import {
  removeItem,
  setCartItemId,
  updateQuantity,
  upsertItem,
} from '../cartSlice';
import {
  CART_API,
  CART_MESSAGES,
  CART_MUTATION_KEYS,
  CART_QUERY_KEY,
} from '../constants/cart.constants';
import type { AddCartPayload, CartApiResponse, CartItem } from '../types';

/**
 * Adds an item to the cart and keeps the local cart
 * synchronized with the server response.
 */
export function useAddCartMutation() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const store = useStore<RootState>();

  return useMutation({
    mutationKey: CART_MUTATION_KEYS.ADD,

    mutationFn: async (payload: AddCartPayload): Promise<CartApiResponse> => {
      const response = await api.post<CartApiResponse>(CART_API.BASE, {
        restaurantId: payload.restaurantId,
        menuId: payload.menuId,
        quantity: payload.quantity,
      });

      return response.data;
    },

    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: CART_QUERY_KEY,
      });

      const existingItem = store
        .getState()
        .cart.items.find((item) => item.menuId === payload.menuId);
      const previousItem: CartItem | undefined = existingItem
        ? { ...existingItem }
        : undefined;

      dispatch(
        upsertItem({
          menuId: payload.menuId,
          restaurantId: payload.restaurantId,
          restaurantName: payload.restaurantName,
          name: payload.name,
          price: payload.price,
          type: payload.type,
          image: payload.image,
          qty: (existingItem?.qty ?? 0) + payload.quantity,
          cartItemId: existingItem?.cartItemId,
        }),
      );

      return { previousItem, menuId: payload.menuId };
    },

    onError: (_error, _payload, context) => {
      if (context) {
        if (context.previousItem) {
          dispatch(upsertItem(context.previousItem));
        } else {
          dispatch(removeItem(context.menuId));
        }
      }

      toast.error(CART_MESSAGES.ADD_ERROR);
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

      queryClient.invalidateQueries({
        queryKey: CART_QUERY_KEY,
      });

      toast.success(CART_MESSAGES.ADD_SUCCESS);
    },
  });
}
