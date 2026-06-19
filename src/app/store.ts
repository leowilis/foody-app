import { configureStore } from '@reduxjs/toolkit';
import categoryFilterReducer from '@/features/filters/categoryFilterSlice'

/**
 * Central application Redux store initialization.
 *
 * Configures the global state management engine, combining domain-specific
 * slices and auto-injecting production middleware (like Redux Thunk).
 */
export const store = configureStore({
  reducer: {
    categoryFilter: categoryFilterReducer,
  }, // Domain slices will be registered here
  
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
