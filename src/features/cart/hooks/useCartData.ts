import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { setItems } from '@/features/cart/cartSlice';
import { api } from '@/lib/api';
import { CART_API, CART_QUERY_KEY } from '../constants/cart.constants';
import type { CartResponse, CartRestaurant } from '../types';

/**
 * Fetches the authenticated cart and keeps Redux synchronized
 * with the latest API cart data.
 */
export function useCartData() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const query = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const res = await api.get<CartResponse>(CART_API.BASE);
      return res.data;
    },
  });

  useEffect(() => {
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
        image: item.menu.image,
        restaurantId: group.restaurant.id,
        restaurantName: group.restaurant.name,
        qty: item.quantity,
      })),
    );

    dispatch(setItems(apiItems));
  }, [query.data, dispatch]);

  const reduxCartGroups = useMemo<CartRestaurant[]>(() => {
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
            type: 'food' as const,
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
              logo: '/images/common/icon-restaurant-dummy.svg',
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

  const apiCart = query.data?.data?.cart;
  const cartGroups = apiCart && apiCart.length > 0 ? apiCart : reduxCartGroups;

  return {
    cartGroups,
    cartItems,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
