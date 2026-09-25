import { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { setCartItemId } from '@/features/cart/cartSlice';
import { api } from '@/lib/api';
import { CartApiResponseSchema } from '../schemas/cartSchema';
import type { CartItem } from '../types';

type SyncResult = {
  menuId: number;
  cartItemId: number;
};

// Synchronizes a single guest cart item with the authenticated user's cart.
async function syncSingleItem(item: CartItem): Promise<SyncResult | null> {
  const res = await api.post('/api/cart', {
    menuId: item.menuId,
    restaurantId: item.restaurantId,
    quantity: item.qty,
  });

  const parsed = CartApiResponseSchema.safeParse(res.data);

  if (!parsed.success || !parsed.data.data?.cartItem) {
    return null;
  }

  return {
    menuId: item.menuId,
    cartItemId: parsed.data.data.cartItem.id,
  };
}

/**
 * Synchronizes guest cart items with the authenticated user's cart
 * after the user becomes authenticated.
 */
export function useCartSync(isLoggedIn: boolean) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const hasSynced = useRef(false);

  const { mutate: syncCart, isPending: isSyncing } = useMutation({
    mutationFn: async (): Promise<SyncResult[]> => {
      const guestItems = cartItems.filter((item) => !item.cartItemId);

      if (guestItems.length === 0) {
        return [];
      }
      const results = await Promise.allSettled(guestItems.map(syncSingleItem));
      return results
        .filter(
          (result): result is PromiseFulfilledResult<SyncResult | null> =>
            result.status === 'fulfilled',
        )
        .flatMap((result) => (result.value ? [result.value] : []));
    },

    onSuccess: (results) => {
      results.forEach(({ menuId, cartItemId }) => {
        dispatch(
          setCartItemId({
            menuId,
            cartItemId,
          }),
        );
      });
      hasSynced.current = true;
    },
  });

  useEffect(() => {
    if (hasSynced.current || !isLoggedIn) {
      return;
    }
    const hasGuestItems = cartItems.some((item) => !item.cartItemId);
    if (!hasGuestItems || isSyncing) {
      return;
    }
    syncCart();
  }, [isLoggedIn, cartItems, isSyncing, syncCart]);

  return {
    isSyncing,
  };
}
