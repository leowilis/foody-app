import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from './types';

type CartState = {
  items: CartItem[];
};

// Client-side hydration cache loader
const loadCartState = (): CartState => {
  if (typeof window === 'undefined') return { items: [] };
  try {
    const raw = localStorage.getItem('cart_state');
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw) as CartState;
    return { items: parsed.items ?? [] };
  } catch {
    return { items: [] };
  }
};

// Safety helper to lock states into persistent browser memory slots
const saveCartState = (state: CartState) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('cart_state', JSON.stringify({ items: state.items }));
  } catch (error) {
    console.error('Failed to commit cart updates to local disk caches:', error);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCartState(),
  reducers: {
    setItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      saveCartState(state); // Enforced persistent disk saving boundaries
    },
    upsertItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(
        (item) => item.menuId === action.payload.menuId,
      );
      if (existing) {
        Object.assign(existing, {
          ...action.payload,
          cartItemId: action.payload.cartItemId ?? existing.cartItemId,
        });
      } else {
        state.items.push(action.payload);
      }
      saveCartState(state);
    },
    updateQuantity(
      state,
      action: PayloadAction<{ menuId: number; qty: number }>,
    ) {
      const existing = state.items.find(
        (item) => item.menuId === action.payload.menuId,
      );
      if (existing) {
        existing.qty = action.payload.qty;
      }
      saveCartState(state);
    },
    setCartItemId(
      state,
      action: PayloadAction<{ menuId: number; cartItemId: number }>,
    ) {
      const existing = state.items.find(
        (item) => item.menuId === action.payload.menuId,
      );
      if (existing) {
        existing.cartItemId = action.payload.cartItemId;
      }
      saveCartState(state);
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.menuId !== action.payload,
      );
      saveCartState(state);
    },
    clearCart(state) {
      state.items = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart_state'); // Completely evicts empty storage arrays from disk paths
      }
    },
  },
});

export const {
  setItems,
  upsertItem,
  updateQuantity,
  setCartItemId,
  removeItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
