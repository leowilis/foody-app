import type { CartRestaurant, CartResponse, CartGroupItem } from '../types';

interface UpdateCartCacheParams {
  cartItemId: number;
  quantity: number;
}

interface RemoveCartCacheParams {
  cartItemId: number;
}

interface RestoreCartItemParams {
  item: CartGroupItem;
  restaurant: CartRestaurant['restaurant'];
  itemIndex: number;
}

// Recalculates cart totals after an optimistic cache update.
function updateCartSummary(
  cart: CartResponse,
  groups: CartRestaurant[],
): CartResponse {
  const totalItems = groups.reduce(
    (total, group) =>
      total + group.items.reduce((sum, item) => sum + item.quantity, 0),
    0,
  );

  const totalPrice = groups.reduce((total, group) => total + group.subtotal, 0);

  return {
    ...cart,
    data: {
      ...cart.data,
      cart: groups,
      summary: {
        ...cart.data?.summary,
        totalItems,
        totalPrice,
        restaurantCount: groups.length,
      },
    },
  };
}

// Updates an item's quantity and recalculates affected cart totals.
export function updateCartCache(
  cart: CartResponse | undefined,
  { cartItemId, quantity }: UpdateCartCacheParams,
): CartResponse | undefined {
  if (!cart?.data?.cart) {
    return cart;
  }

  const hasTargetItem = cart.data.cart.some((group) =>
    group.items.some((item) => item.id === cartItemId),
  );

  if (!hasTargetItem) {
    return cart;
  }

  const groups = cart.data.cart.map((group) => {
    if (!group.items.some((item) => item.id === cartItemId)) {
      return group;
    }

    const items = group.items.map((item) =>
      item.id === cartItemId
        ? {
            ...item,
            quantity,
            itemTotal: item.menu.price * quantity,
          }
        : item,
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
  });

  return updateCartSummary(cart, groups);
}

/**
 * Removes an item and recalculates the remaining cart totals.
 * Empty restaurant groups are removed after deletion.
 */
export function removeCartItemFromCache(
  cart: CartResponse | undefined,
  { cartItemId }: RemoveCartCacheParams,
): CartResponse | undefined {
  if (!cart?.data?.cart) {
    return cart;
  }

  const hasTargetItem = cart.data.cart.some((group) =>
    group.items.some((item) => item.id === cartItemId),
  );

  if (!hasTargetItem) {
    return cart;
  }

  const groups = cart.data.cart
    .map((group) => {
      const items = group.items.filter((item) => item.id !== cartItemId);

      if (items.length === group.items.length) {
        return group;
      }

      return {
        ...group,
        items,
      };
    })
    .filter((group) => group.items.length > 0);

  return updateCartSummary(cart, groups);
}

export function restoreCartItemInCache(
  currentCart: CartResponse | undefined,
  { item, restaurant, itemIndex }: RestoreCartItemParams,
): CartResponse | undefined {
  if (!currentCart?.data?.cart) {
    return currentCart;
  }

  const groups = [...currentCart.data.cart];
  const groupIndex = groups.findIndex(
    (group) => group.restaurant.id === restaurant.id,
  );

  const restoredItem: CartGroupItem = {
    ...item,
    itemTotal: item.menu.price * item.quantity,
  };

  if (groupIndex === -1) {
    groups.push({
      restaurant,
      items: [restoredItem],
      subtotal: restoredItem.itemTotal,
    });
  } else {
    const group = groups[groupIndex];

    if (group.items.some((existing) => existing.id === item.id)) {
      return currentCart;
    }

    const items = [...group.items];
    items.splice(Math.min(itemIndex, items.length), 0, restoredItem);

    groups[groupIndex] = {
      ...group,
      items,
      subtotal: items.reduce(
        (total, current) => total + current.menu.price * current.quantity,
        0,
      ),
    };
  }

  return updateCartSummary(currentCart, groups);
}
