import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import cartReducer from '../cartSlice';
import { CART_API, CART_QUERY_KEY } from '../constants/cart.constants';
import type { CartItem, CartResponse, DeleteCartPayload } from '../types';
import { api } from '@/lib/api';
import { useDeleteCartMutation } from './useDeleteCartMutation';

vi.mock('@/lib/api', () => ({
  api: {
    delete: vi.fn(),
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

const firstItem: CartItem = {
  menuId: 20,
  restaurantId: 10,
  restaurantName: 'Test Restaurant',
  name: 'First Food',
  price: 25000,
  type: 'food',
  image: '/first-food.jpg',
  qty: 2,
  cartItemId: 100,
};

const secondItem: CartItem = {
  menuId: 21,
  restaurantId: 10,
  restaurantName: 'Test Restaurant',
  name: 'Second Food',
  price: 30000,
  type: 'food',
  image: '/second-food.jpg',
  qty: 3,
  cartItemId: 101,
};

const anotherRestaurantItem: CartItem = {
  menuId: 30,
  restaurantId: 11,
  restaurantName: 'Another Restaurant',
  name: 'Third Food',
  price: 15000,
  type: 'food',
  image: '/third-food.jpg',
  qty: 1,
  cartItemId: 102,
};

const payload: DeleteCartPayload = {
  cartItemId: 100,
  menuId: 20,
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
              foodName: 'First Food',
              price: 25000,
              type: 'food',
              image: '/first-food.jpg',
            },
          },
          {
            id: 101,
            quantity: 3,
            itemTotal: 90000,
            menu: {
              id: 21,
              foodName: 'Second Food',
              price: 30000,
              type: 'food',
              image: '/second-food.jpg',
            },
          },
        ],
        subtotal: 140000,
      },
      {
        restaurant: {
          id: 11,
          name: 'Another Restaurant',
          logo: '/another-restaurant.jpg',
        },
        items: [
          {
            id: 102,
            quantity: 1,
            itemTotal: 15000,
            menu: {
              id: 30,
              foodName: 'Third Food',
              price: 15000,
              type: 'food',
              image: '/third-food.jpg',
            },
          },
        ],
        subtotal: 15000,
      },
    ],
    summary: {
      totalItems: 6,
      totalPrice: 155000,
      restaurantCount: 2,
    },
  },
};

describe('useDeleteCartMutation', () => {
  beforeEach(() => {
    vi.mocked(api.delete).mockReset();
  });

  it('optimistically removes an item and recalculates the cart summary', async () => {
    let resolveRequest!: (value: {
      data: {
        success: boolean;
        message: string;
      };
    }) => void;

    vi.mocked(api.delete).mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }) as never,
    );

    const store = createStore([firstItem, secondItem, anotherRestaurantItem]);

    const queryClient = createQueryClient();
    queryClient.setQueryData(CART_QUERY_KEY, cartResponse);

    const wrapper = createWrapper(store, queryClient);

    const { result } = renderHook(() => useDeleteCartMutation(), {
      wrapper,
    });

    act(() => {
      result.current.mutate(payload);
    });

    await waitFor(() => {
      expect(store.getState().cart.items.map((item) => item.menuId)).toEqual([
        21, 30,
      ]);

      const updatedCart =
        queryClient.getQueryData<CartResponse>(CART_QUERY_KEY);

      expect(updatedCart?.data?.cart?.[0].items.map((item) => item.id)).toEqual(
        [101],
      );

      expect(updatedCart?.data?.summary).toEqual({
        totalItems: 4,
        totalPrice: 105000,
        restaurantCount: 2,
      });
    });

    await act(async () => {
      resolveRequest({
        data: {
          success: true,
          message: 'Item removed from cart successfully',
        },
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(api.delete).toHaveBeenCalledWith(CART_API.ITEM(100));
  });

  it('removes an empty restaurant group from the cart cache', async () => {
    vi.mocked(api.delete).mockResolvedValue({
      data: {
        success: true,
        message: 'Item removed from cart successfully',
      },
    } as never);

    const store = createStore([firstItem]);
    const queryClient = createQueryClient();

    const singleRestaurantCart: CartResponse = {
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
                  foodName: 'First Food',
                  price: 25000,
                  type: 'food',
                  image: '/first-food.jpg',
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

    queryClient.setQueryData(CART_QUERY_KEY, singleRestaurantCart);

    const wrapper = createWrapper(store, queryClient);

    const { result } = renderHook(() => useDeleteCartMutation(), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync(payload);
    });

    await waitFor(() => {
      const updatedCart =
        queryClient.getQueryData<CartResponse>(CART_QUERY_KEY);

      expect(updatedCart?.data?.cart).toHaveLength(0);
      expect(updatedCart?.data?.summary).toEqual({
        totalItems: 0,
        totalPrice: 0,
        restaurantCount: 0,
      });
    });
  });

  it('restores Redux and cache when the API request fails', async () => {
    vi.mocked(api.delete).mockRejectedValue(new Error('Request failed'));

    const store = createStore([firstItem, secondItem, anotherRestaurantItem]);

    const queryClient = createQueryClient();
    queryClient.setQueryData(CART_QUERY_KEY, cartResponse);

    const wrapper = createWrapper(store, queryClient);

    const { result } = renderHook(() => useDeleteCartMutation(), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync(payload).catch(() => undefined);
    });

    await waitFor(() => {
      expect(store.getState().cart.items.map((item) => item.menuId)).toEqual([
        20, 21, 30,
      ]);

      const restoredCart =
        queryClient.getQueryData<CartResponse>(CART_QUERY_KEY);

      expect(
        restoredCart?.data?.cart?.[0].items.map((item) => item.id),
      ).toEqual([100, 101]);

      expect(restoredCart?.data?.summary).toEqual({
        totalItems: 6,
        totalPrice: 155000,
        restaurantCount: 2,
      });
    });

    expect(result.current.isError).toBe(true);
  });

  it('restores the original restaurant group when deleting its only item fails', async () => {
    vi.mocked(api.delete).mockRejectedValue(new Error('Request failed'));

    const store = createStore([firstItem]);
    const queryClient = createQueryClient();

    const singleRestaurantCart: CartResponse = {
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
                  foodName: 'First Food',
                  price: 25000,
                  type: 'food',
                  image: '/first-food.jpg',
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

    queryClient.setQueryData(CART_QUERY_KEY, singleRestaurantCart);

    const wrapper = createWrapper(store, queryClient);

    const { result } = renderHook(() => useDeleteCartMutation(), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync(payload).catch(() => undefined);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(store.getState().cart.items).toEqual([firstItem]);

      const restoredCart =
        queryClient.getQueryData<CartResponse>(CART_QUERY_KEY);

      expect(restoredCart?.data?.cart).toHaveLength(1);
      expect(restoredCart?.data?.cart?.[0].restaurant.id).toBe(10);
      expect(restoredCart?.data?.cart?.[0].items).toHaveLength(1);
      expect(restoredCart?.data?.cart?.[0].items[0].id).toBe(100);
      expect(restoredCart?.data?.cart?.[0].subtotal).toBe(50000);

      expect(restoredCart?.data?.summary).toEqual({
        totalItems: 2,
        totalPrice: 50000,
        restaurantCount: 1,
      });
    });
  });
});
