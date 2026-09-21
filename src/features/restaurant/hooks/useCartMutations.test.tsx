import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import cartReducer from '@/features/cart/cartSlice';
import categoryFilterReducer from '@/features/filters/categoryFilterSlice';
import searchReducer from '@/features/search/searchSlice';
import { api } from '@/lib/api';
import { useCartMutations } from './useCartMutations';
import type { RestaurantDetail } from '../schemas/restaurantSchema';

const mockRestaurantDetail: RestaurantDetail = {
  id: 1,
  name: 'Test Restaurant',
  star: 4.5,
  averageRating: 4.5,
  place: 'Medan',
  coordinates: {
    lat: 3.5952,
    long: 98.6722,
  },
  logo: '',
  images: [],
  category: 'Food',
  totalMenus: 1,
  totalReviews: 0,
  menus: [
    {
      id: 10,
      foodName: 'Test Food',
      price: 25000,
      type: 'food',
      image: '',
    },
  ],
  reviews: [],
};

// Creates an isolated Redux store for each test.
const createTestStore = () =>
  configureStore({
    reducer: {
      cart: cartReducer,
      categoryFilter: categoryFilterReducer,
      search: searchReducer,
    },
  });

/**
 * Creates an isolated React Query client and Redux provider
 * for testing the cart mutation hook.
 */
const createTestWrapper = () => {
  const testStore = createTestStore();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return function TestWrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={testStore}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </Provider>
    );
  };
};

beforeEach(() => {
  localStorage.setItem('auth_token', 'test-token');
});

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

/**
 * Tests optimistic cart mutations and rollback behavior
 * for the restaurant cart flow.
 */
describe('useCartMutations', () => {
  it('adds a new item to the cart optimistically', async () => {
    vi.spyOn(api, 'post').mockResolvedValueOnce({
      data: {
        data: {
          cartItem: {
            id: 100,
            quantity: 1,
          },
        },
      },
    });

    const { result } = renderHook(
      () => useCartMutations(mockRestaurantDetail),
      {
        wrapper: createTestWrapper(),
      },
    );

    act(() => {
      result.current.addMutation.mutate({
        restaurantId: 1,
        menuId: 10,
        quantity: 1,
      });
    });

    // The cart updates immediately before the API request completes.
    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].menuId).toBe(10);

    await waitFor(() => {
      expect(result.current.addMutation.isSuccess).toBe(true);
    });
  });

  it('rolls back the cart when adding an item fails', async () => {
    vi.spyOn(api, 'post').mockRejectedValueOnce(new Error('server error'));

    const { result } = renderHook(
      () => useCartMutations(mockRestaurantDetail),
      {
        wrapper: createTestWrapper(),
      },
    );

    act(() => {
      result.current.addMutation.mutate({
        restaurantId: 1,
        menuId: 10,
        quantity: 1,
      });
    });

    // The item appears immediately because the mutation is optimistic.
    expect(result.current.cartItems).toHaveLength(1);

    await waitFor(() => {
      expect(result.current.addMutation.isError).toBe(true);
    });

    // The optimistic update is reverted after the API request fails.
    expect(result.current.cartItems).toHaveLength(0);
  });
});
