import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { upsertItem } from '../cartSlice';
import type { CartGroupItem, CartRestaurant } from '../types';

interface CartMutationHandlers {
  updateMutation: {
    isPending: boolean;
    mutate: (payload: { cartItemId: number; quantity: number }) => void;
  };
  deleteMutation: {
    isPending: boolean;
    mutate: (payload: { cartItemId: number; menuId: number }) => void;
  };
}

interface UseCartHandlersProps {
  mutations: CartMutationHandlers;
}

/**
 * Handles user interactions for changing cart item quantities.
 *
 * Delegates server mutations to the mutation layer while keeping
 * UI interaction logic and guest-cart Redux updates here.
 */
export function useCartHandlers({ mutations }: UseCartHandlersProps) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { updateMutation, deleteMutation } = mutations;
  const isItemPending = useCallback(
    (cartItemId: number) =>
      cartItems.some((item) => item.cartItemId === cartItemId) &&
      (updateMutation.isPending || deleteMutation.isPending),
    [cartItems, updateMutation.isPending, deleteMutation.isPending],
  );

  const handleIncrease = useCallback(
    (item: CartGroupItem, group: CartRestaurant) => {
      if (isItemPending(item.id)) {
        return;
      }
      const nextQuantity = item.quantity + 1;

      dispatch(
        upsertItem({
          menuId: item.menu.id,
          cartItemId: item.id,
          name: item.menu.foodName,
          price: item.menu.price,
          image: item.menu.image,
          restaurantId: group.restaurant.id,
          restaurantName: group.restaurant.name,
          qty: nextQuantity,
        }),
      );
      updateMutation.mutate({
        cartItemId: item.id,
        quantity: nextQuantity,
      });
    },
    [dispatch, isItemPending, updateMutation],
  );

  const handleDecrease = useCallback(
    (item: CartGroupItem, group: CartRestaurant) => {
      if (isItemPending(item.id)) {
        return;
      }
      const nextQuantity = item.quantity - 1;

      if (nextQuantity <= 0) {
        deleteMutation.mutate({
          cartItemId: item.id,
          menuId: item.menu.id,
        });

        return;
      }

      dispatch(
        upsertItem({
          menuId: item.menu.id,
          cartItemId: item.id,
          name: item.menu.foodName,
          price: item.menu.price,
          image: item.menu.image,
          restaurantId: group.restaurant.id,
          restaurantName: group.restaurant.name,
          qty: nextQuantity,
        }),
      );
      updateMutation.mutate({
        cartItemId: item.id,
        quantity: nextQuantity,
      });
    },
    [deleteMutation, dispatch, isItemPending, updateMutation],
  );

  return {
    handleIncrease,
    handleDecrease,
    isItemPending,
  };
}
