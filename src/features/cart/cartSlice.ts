import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from './types';

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
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
        return;
      }

      state.items.push(action.payload);
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
    },

    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.menuId !== action.payload,
      );
    },

    restoreItem(
      state,
      action: PayloadAction<{ item: CartItem; index: number }>,
    ) {
      const { item, index } = action.payload;

      const existingIndex = state.items.findIndex(
        (current) => current.menuId === item.menuId,
      );

      if (existingIndex !== -1) {
        state.items.splice(existingIndex, 1);
      }

      const safeIndex = Math.max(0, Math.min(index, state.items.length));

      state.items.splice(safeIndex, 0, item);
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  setItems,
  upsertItem,
  updateQuantity,
  setCartItemId,
  removeItem,
  restoreItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
