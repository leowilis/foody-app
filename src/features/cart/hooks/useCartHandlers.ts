import { useCallback } from 'react';
import { useMutationState } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import type { CartItem } from '../types';
import type { CartMutations } from './useCartMutations';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '@/features/auth/authStorage';

type PendingCartMutationVariables = {
  menuId?: number;
};

interface UseCartHandlersProps {
  mutations: CartMutations;
}

export type CartHandlers = {
  readonly handleIncrease: (item: CartItem) => void;
  readonly handleDecrease: (menuId: number) => void;
  readonly isItemPending: (menuId: number) => boolean;
};

/**
 * Handles cart item actions while keeping mutation ownership
 * inside the cart mutation hooks.
 */
export function useCartHandlers({
  mutations,
}: UseCartHandlersProps): CartHandlers {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const navigate = useNavigate();

  const requireAuth = useCallback(() => {
    if (getAuthToken()) {
      return true;
    }

    navigate('/auth', {
      state: { tab: 'signin' },
    });

    return false;
  }, [navigate]);

  // Track pending mutations so the same item cannot be changed twice.
  const pendingMenuIds = useMutationState<number | undefined>({
    filters: {
      mutationKey: ['cart'],
      status: 'pending',
    },
    select: (mutation) => {
      const variables = mutation.state.variables as
        | PendingCartMutationVariables
        | undefined;

      return variables?.menuId;
    },
  });

  const isItemPending = useCallback(
    (menuId: number) =>
      pendingMenuIds.some((pendingMenuId) => pendingMenuId === menuId),
    [pendingMenuIds],
  );

  const handleIncrease = useCallback(
    (item: CartItem) => {
      if (!requireAuth() || isItemPending(item.menuId)) {
        return;
      }

      const existingItem = cartItems.find(
        (cartItem) => cartItem.menuId === item.menuId,
      );

      // Existing server items use the update mutation.
      if (existingItem?.cartItemId) {
        mutations.updateMutation.mutate({
          cartItemId: existingItem.cartItemId,
          menuId: existingItem.menuId,
          quantity: existingItem.qty + 1,
        });

        return;
      }

      // New items are added through the server mutation.
      mutations.addMutation.mutate({
        restaurantId: item.restaurantId,
        restaurantName: item.restaurantName,
        menuId: item.menuId,
        quantity: 1,
        name: item.name,
        price: item.price,
        type: item.type,
        image: item.image,
      });
    },
    [requireAuth, isItemPending, cartItems, mutations],
  );

  const handleDecrease = useCallback(
    (menuId: number) => {
      if (!requireAuth() || isItemPending(menuId)) {
        return;
      }

      const item = cartItems.find((cartItem) => cartItem.menuId === menuId);

      if (!item?.cartItemId) {
        return;
      }

      const nextQuantity = item.qty - 1;

      // Remove the server-backed item when its quantity reaches zero.
      if (nextQuantity <= 0) {
        mutations.deleteMutation.mutate({
          cartItemId: item.cartItemId,
          menuId: item.menuId,
        });

        return;
      }

      // Keep the server-backed quantity synchronized with the API.
      mutations.updateMutation.mutate({
        cartItemId: item.cartItemId,
        menuId: item.menuId,
        quantity: nextQuantity,
      });
    },
    [requireAuth, cartItems, isItemPending, mutations],
  );

  return {
    handleIncrease,
    handleDecrease,
    isItemPending,
  };
}
