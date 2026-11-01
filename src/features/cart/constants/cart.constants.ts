export const CART_QUERY_KEY = ['cart'] as const;

export const CART_MUTATION_KEYS = {
  ADD: ['cart', 'add'] as const,
  UPDATE: ['cart', 'update'] as const,
  DELETE: ['cart', 'delete'] as const,
  CLEAR: ['cart', 'clear'] as const,
} as const;

export const CART_API = {
  BASE: '/api/cart',
  ITEM: (cartItemId: number) => `/api/cart/${cartItemId}`,
  CLEAR: '/api/cart',
} as const;

export const CART_MESSAGES = {
  ADD_SUCCESS: 'Item added to cart',
  ADD_ERROR: 'Failed to add item to cart',
  UPDATE_SUCCESS: 'Cart updated',
  UPDATE_ERROR: 'Failed to update cart',
  DELETE_SUCCESS: 'Item removed from cart',
  DELETE_ERROR: 'Failed to remove item',
} as const;
