import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import type { RootState } from '@/app/store';
import { api } from '@/lib/api';
import {
  removeItem,
  setCartItemId,
  setItems,
  updateQuantity,
} from '../cartSlice';
import {
  CART_API,
  CART_MESSAGES,
  CART_QUERY_KEY,
} from '../constants/cart.constants';
import type {
  CartResponse,
  DeleteCartResponse,
  UpdateCartResponse,
} from '../types';
import { removeCartItemFromCache, updateCartCache } from '../utils/cart.utils';

interface UpdateCartPayload {
  cartItemId: number;
  quantity: number;
}

interface DeleteCartPayload {
  cartItemId: number;
  menuId: number;
}

/**
 * Provides cart item update and delete mutations.
 *
 * Handles optimistic React Query and Redux updates with rollback
 * when a server mutation fails.
 */
export function useCartMutations() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const updateMutation = useMutation<
    UpdateCartResponse,
    Error,
    UpdateCartPayload,
    {
      previousCart: CartResponse | undefined;
      previousItems: typeof cartItems;
    }
  >({
    mutationFn: async ({ cartItemId, quantity }) => {
      const response = await api.put<UpdateCartResponse>(
        CART_API.ITEM(cartItemId),
        { quantity },
      );

      return response.data;
    },

    onMutate: async ({ cartItemId, quantity }) => {
      await queryClient.cancelQueries({
        queryKey: CART_QUERY_KEY,
      });
      const previousCart =
        queryClient.getQueryData<CartResponse>(CART_QUERY_KEY);

      const previousItems = [...cartItems];

      queryClient.setQueryData<CartResponse>(CART_QUERY_KEY, (currentCart) =>
        updateCartCache(currentCart, {
          cartItemId,
          quantity,
        }),
      );

      const targetItem = cartItems.find(
        (item) => item.cartItemId === cartItemId,
      );
      if (targetItem) {
        dispatch(
          updateQuantity({
            menuId: targetItem.menuId,
            qty: quantity,
          }),
        );
      }
      return {
        previousCart,
        previousItems,
      };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }

      if (context?.previousItems) {
        dispatch(setItems(context.previousItems));
      }
      toast.error(CART_MESSAGES.UPDATE_ERROR);
    },

    onSuccess: (response, variables) => {
      const cartItem = response.data?.cartItem;

      const targetItem = cartItems.find(
        (item) => item.cartItemId === variables.cartItemId,
      );
      if (targetItem && cartItem?.id) {
        dispatch(
          setCartItemId({
            menuId: targetItem.menuId,
            cartItemId: cartItem.id,
          }),
        );
      }
      if (targetItem && typeof cartItem?.quantity === 'number') {
        dispatch(
          updateQuantity({
            menuId: targetItem.menuId,
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

  const deleteMutation = useMutation<
    DeleteCartResponse,
    Error,
    DeleteCartPayload,
    {
      previousCart: CartResponse | undefined;
      previousItems: typeof cartItems;
    }
  >({
    mutationFn: async ({ cartItemId }) => {
      const response = await api.delete<DeleteCartResponse>(
        CART_API.ITEM(cartItemId),
      );
      return response.data;
    },

    onMutate: async ({ cartItemId, menuId }) => {
      await queryClient.cancelQueries({
        queryKey: CART_QUERY_KEY,
      });

      const previousCart =
        queryClient.getQueryData<CartResponse>(CART_QUERY_KEY);

      const previousItems = [...cartItems];

      queryClient.setQueryData<CartResponse>(CART_QUERY_KEY, (currentCart) =>
        removeCartItemFromCache(currentCart, {
          cartItemId,
        }),
      );
      dispatch(removeItem(menuId));

      return {
        previousCart,
        previousItems,
      };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }

      if (context?.previousItems) {
        dispatch(setItems(context.previousItems));
      }
      toast.error(CART_MESSAGES.DELETE_ERROR);
    },

    onSuccess: () => {
      toast.success(CART_MESSAGES.DELETE_SUCCESS);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: CART_QUERY_KEY,
      });
    },
  });

  return {
    updateMutation,
    deleteMutation,
  };
}
