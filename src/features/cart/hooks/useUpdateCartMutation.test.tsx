import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import cartReducer from '../cartSlice';
import { CART_API, CART_QUERY_KEY } from '../constants/cart.constants';
import type { CartItem, CartResponse, UpdateCartPayload } from '../types';
import { api } from '@/lib/api';
import { useUpdateCartMutation } from './useUpdateCartMutation';

vi.mock('@/lib/api', () => ({
  api: {
    put: vi.fn(),
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

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const createWrapper =
  (store: ReturnType<typeof createStore>, queryClient: QueryClient) =>
  ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );

const existingItem: CartItem = {
  menuId: 20,
  restaurantId: 10,
  restaurantName: 'Test Restaurant',
  name: 'Test Food',
  price: 25000,
  type: 'food',
  image: '/test-food.jpg',
  qty: 2,
  cartItemId: 100,
};

const payload: UpdateCartPayload = {
  cartItemId: 100,
  menuId: 20,
  quantity: 5,
};

const cartResponse: CartResponse = {
  success: true,
  data: {
    cart: [
      {
        restaurant: {
          id: 10,
          name: 'Test Restaurant',
          logo: '/restaurant.jpg',
        },
        items: [
          {
            id: 100,
            quantity: 2,
            itemTotal: 50000,
            menu: {
              id: 20,
              foodName: 'Test Food',
              price: 25000,
              type: 'food',
              image: '/test-food.jpg',
            },
          },
        ],
        subtotal: 50000,
      },
    ],
    summary: {
      totalItems: 2,
      totalPrice: 50000,
      restaurantCount: 1,
    },
  },
};

describe('useUpdateCartMutation', () => {
  beforeEach(() => {
    vi.mocked(api.put).mockReset();
  });

  it('optimistically updates Redux and cart cache before the API request completes', async () => {
    let resolveRequest!: (value: {
      data: {
        success: boolean;
        data: {
          cartItem: { id: number; quantity: number };
        };
      };
    }) => void;

    vi.mocked(api.put).mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }) as never,
    );

    const store = createStore([existingItem]);
    const queryClient = createQueryClient();
    queryClient.setQueryData(CART_QUERY_KEY, cartResponse);

    const wrapper = createWrapper(store, queryClient);

    const { result } = renderHook(() => useUpdateCartMutation(), {
      wrapper,
    });

    act(() => {
      result.current.mutate(payload);
    });

    await waitFor(() => {
      expect(store.getState().cart.items[0].qty).toBe(5);
      expect(
        queryClient.getQueryData<CartResponse>(CART_QUERY_KEY)?.data?.cart?.[0]
          .items[0].quantity,
      ).toBe(5);
    });

    expect(
      queryClient.getQueryData<CartResponse>(CART_QUERY_KEY)?.data?.summary,
    ).toMatchObject({
      totalItems: 5,
      totalPrice: 125000,
      restaurantCount: 1,
    });

    await act(async () => {
      resolveRequest({
        data: {
          success: true,
          data: {
            cartItem: {
              id: 200,
              quantity: 4,
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
      qty: 4,
    });

    expect(api.put).toHaveBeenCalledWith(CART_API.ITEM(100), {
      quantity: 5,
    });
  });

  it('restores Redux and cart cache when the API request fails', async () => {
    vi.mocked(api.put).mockRejectedValue(new Error('Request failed'));

    const store = createStore([existingItem]);
    const queryClient = createQueryClient();
    queryClient.setQueryData(CART_QUERY_KEY, cartResponse);

    const wrapper = createWrapper(store, queryClient);

    const { result } = renderHook(() => useUpdateCartMutation(), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync(payload).catch(() => undefined);
    });

    await waitFor(() => {
      expect(store.getState().cart.items[0].qty).toBe(2);
      expect(
        queryClient.getQueryData<CartResponse>(CART_QUERY_KEY)?.data?.cart?.[0]
          .items[0].quantity,
      ).toBe(2);
    });

    expect(result.current.isError).toBe(true);
  });

  it('rolls back Redux and cart cache when the API returns an unsuccessful response', async () => {
    vi.mocked(api.put).mockResolvedValue({
      data: {
        success: false,
        message: 'Unable to update cart item',
      },
    } as never);

    const store = createStore([existingItem]);
    const queryClient = createQueryClient();
    queryClient.setQueryData(CART_QUERY_KEY, cartResponse);

    const wrapper = createWrapper(store, queryClient);

    const { result } = renderHook(() => useUpdateCartMutation(), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync(payload).catch(() => undefined);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(store.getState().cart.items[0].qty).toBe(2);
      expect(
        queryClient.getQueryData<CartResponse>(CART_QUERY_KEY)?.data?.cart?.[0]
          .items[0].quantity,
      ).toBe(2);
    });
  });
});
