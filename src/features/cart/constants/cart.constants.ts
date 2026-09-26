export const CART_QUERY_KEY = ['cart'] as const;

export const CART_API = {
  BASE: '/api/cart',
  ITEM: (cartItemId: number) => `/api/cart/${cartItemId}`,
} as const;

export const CART_MESSAGES = {
  UPDATE_SUCCESS: 'Cart updated',
  UPDATE_ERROR: 'Failed to update cart',
  DELETE_SUCCESS: 'Item removed from cart',
  DELETE_ERROR: 'Failed to remove item',
} as const;

export const CART_SKELETON = {
  GROUP_COUNT: 2,
  ITEMS_PER_GROUP: 2,
} as const;