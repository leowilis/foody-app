import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/features/cart/cartSlice'
import categoryFilterReducer from '@/features/filters/categoryFilterSlice'
import searchReducer from '@/features/search/searchSlice'

/**
 * Central application Redux store initialization.
 *
 * Configures the global state management engine, combining domain-specific
 * slices and auto-injecting production middleware (like Redux Thunk).
 */
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    categoryFilter: categoryFilterReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
