import type { CartResponse } from '../types';

interface UpdateCartCacheParams {
  cartItemId: number;
  quantity: number;
}

interface RemoveCartCacheParams {
  cartItemId: number;
}

/**
 * Updates a cart item's quantity inside the React Query cache.
 *
 * Returns the previous cache structure unchanged when the cart
 * or target item cannot be found.
 */
export function updateCartCache(
  cart: CartResponse | undefined,
  { cartItemId, quantity }: UpdateCartCacheParams,
): CartResponse | undefined {
  if (!cart?.data?.cart) {
    return cart;
  }

  return {
    ...cart,
    data: {
      ...cart.data,
      cart: cart.data.cart.map((group) => {
        const hasTargetItem = group.items.some(
          (item) => item.id === cartItemId,
        );

        if (!hasTargetItem) {
          return group;
        }

        const items = group.items.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item,
        );

        const subtotal = items.reduce(
          (sum, item) => sum + item.menu.price * item.quantity,
          0,
        );

        return {
          ...group,
          items,
          subtotal,
        };
      }),
    },
  };
}

/**
 * Removes a cart item from the React Query cache.
 *
 * Empty restaurant groups are removed after the item is deleted.
 */
export function removeCartItemFromCache(
  cart: CartResponse | undefined,
  { cartItemId }: RemoveCartCacheParams,
): CartResponse | undefined {
  if (!cart?.data?.cart) {
    return cart;
  }

  const groups = cart.data.cart
    .map((group) => {
      const items = group.items.filter((item) => item.id !== cartItemId);

      if (items.length === group.items.length) {
        return group;
      }

      const subtotal = items.reduce(
        (sum, item) => sum + item.menu.price * item.quantity,
        0,
      );

      return {
        ...group,
        items,
        subtotal,
      };
    })
    .filter((group) => group.items.length > 0);

  return {
    ...cart,
    data: {
      ...cart.data,
      cart: groups,
    },
  };
}
