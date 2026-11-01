import { useIsMutating, useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import type { RootState } from '@/app/store';
import { setItems } from '@/features/cart/cartSlice';
import { api } from '@/lib/api';
import { CART_API, CART_QUERY_KEY } from '../constants/cart.constants';
import type { CartResponse, CartRestaurant } from '../types';
import { useIsAuthenticated } from '@/features/auth/hooks/useIsAuthenticated';
import restaurantPlaceholder from '@/assets/icon-restaurant-dummy.svg';

/**
 * Fetches the authenticated user's cart and keeps Redux
 * synchronized with the server state.
 */
export function useCartData() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const pendingCartMutations = useIsMutating({ mutationKey: CART_QUERY_KEY });
  const isAuthenticated = useIsAuthenticated();

  const query = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const response = await api.get<CartResponse>(CART_API.BASE);
      return response.data;
    },
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (pendingCartMutations > 0 || query.isFetching) {
      return;
    }

    const apiCart = query.data?.data?.cart;

    if (!apiCart) {
      return;
    }

    const apiItems = apiCart.flatMap((group) =>
      group.items.map((item) => ({
        menuId: item.menu.id,
        cartItemId: item.id,
        name: item.menu.foodName,
        price: item.menu.price,
        type: item.menu.type,
        image: item.menu.image,
        restaurantId: group.restaurant.id,
        restaurantName: group.restaurant.name,
        qty: item.quantity,
      })),
    );

    dispatch(setItems(apiItems));
  }, [dispatch, pendingCartMutations, query.data, query.isFetching]);

  const cartGroups = useMemo<CartRestaurant[]>(() => {
    if (cartItems.length === 0) {
      return [];
    }

    const grouped = cartItems.reduce<Record<number, CartRestaurant>>(
      (acc, item) => {
        const itemTotal = item.price * item.qty;

        const cartItem = {
          id: item.cartItemId ?? item.menuId,
          menu: {
            id: item.menuId,
            foodName: item.name,
            price: item.price,
            type: item.type,
            image: item.image,
          },
          quantity: item.qty,
          itemTotal,
        };

        const existingGroup = acc[item.restaurantId];

        if (!existingGroup) {
          acc[item.restaurantId] = {
            restaurant: {
              id: item.restaurantId,
              name: item.restaurantName,
              logo: restaurantPlaceholder,
            },
            items: [cartItem],
            subtotal: itemTotal,
          };

          return acc;
        }

        acc[item.restaurantId] = {
          ...existingGroup,
          items: [...existingGroup.items, cartItem],
          subtotal: existingGroup.subtotal + itemTotal,
        };

        return acc;
      },
      {},
    );

    return Object.values(grouped);
  }, [cartItems]);

  return {
    cartGroups,
    cartItems,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
