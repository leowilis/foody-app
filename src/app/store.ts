import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/features/cart/cartSlice'
import categoryFilterReducer from '@/features/filters/categoryFilterSlice'


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
  }, // Domain slices will be registered here
});

// Persist cart to localStorage after every action
store.subscribe(() => {
  const { cart } = store.getState()
  try {
    localStorage.setItem('cart_state', JSON.stringify({ items: cart.items }))
  } catch {
    // ignore storage errors
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
