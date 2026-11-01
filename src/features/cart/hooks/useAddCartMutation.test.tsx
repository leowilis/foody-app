import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import cartReducer from '../cartSlice';
import { CART_API } from '../constants/cart.constants';
import type { AddCartPayload, CartItem } from '../types';
import { api } from '@/lib/api';
import { useAddCartMutation } from './useAddCartMutation';

vi.mock('@/lib/api', () => ({
  api: {
    post: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const createStore = (items: CartItem[] = []) =>
  configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState: {
      cart: { items },
    },
  });

const createWrapper = (store: ReturnType<typeof createStore>) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
};

const payload: AddCartPayload = {
  restaurantId: 10,
  restaurantName: 'Test Restaurant',
  menuId: 20,
  quantity: 2,
  name: 'Test Food',
  price: 25000,
  type: 'food',
  image: '/test-food.jpg',
};

const existingItem: CartItem = {
  menuId: 20,
  restaurantId: 10,
  restaurantName: 'Test Restaurant',
  name: 'Test Food',
  price: 25000,
  type: 'food',
  image: '/test-food.jpg',
  qty: 3,
  cartItemId: 100,
};

describe('useAddCartMutation', () => {
  beforeEach(() => {
    vi.mocked(api.post).mockReset();
  });

  it('optimistically adds an item before the API request completes', async () => {
    let resolveRequest!: (value: {
      data: {
        success: boolean;
        data: {
          cartItem: { id: number; quantity: number };
        };
      };
    }) => void;

    vi.mocked(api.post).mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }) as never,
    );

    const store = createStore();
    const wrapper = createWrapper(store);

    const { result } = renderHook(() => useAddCartMutation(), {
      wrapper,
    });

    act(() => {
      result.current.mutate(payload);
    });

    await waitFor(() => {
      expect(store.getState().cart.items).toHaveLength(1);
    });

    expect(store.getState().cart.items[0]).toMatchObject({
      menuId: payload.menuId,
      qty: payload.quantity,
      name: payload.name,
    });

    await act(async () => {
      resolveRequest({
        data: {
          success: true,
          data: {
            cartItem: {
              id: 200,
              quantity: 2,
            },
          },
        },
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(store.getState().cart.items[0]).toMatchObject({
      cartItemId: 200,
      qty: 2,
    });

    expect(api.post).toHaveBeenCalledWith(CART_API.BASE, {
      restaurantId: payload.restaurantId,
      menuId: payload.menuId,
      quantity: payload.quantity,
    });
  });

  it('removes a newly added item when the API request fails', async () => {
    vi.mocked(api.post).mockRejectedValue(new Error('Request failed'));

    const store = createStore();
    const wrapper = createWrapper(store);

    const { result } = renderHook(() => useAddCartMutation(), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync(payload).catch(() => undefined);
    });

    await waitFor(() => {
      expect(store.getState().cart.items).toHaveLength(0);
    });

    expect(result.current.isError).toBe(true);
  });

  it('restores the existing item when adding more quantity fails', async () => {
    vi.mocked(api.post).mockRejectedValue(new Error('Request failed'));

    const store = createStore([existingItem]);
    const wrapper = createWrapper(store);

    const { result } = renderHook(() => useAddCartMutation(), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync(payload).catch(() => undefined);
    });

    await waitFor(() => {
      expect(store.getState().cart.items[0]).toEqual(existingItem);
    });
  });
});
