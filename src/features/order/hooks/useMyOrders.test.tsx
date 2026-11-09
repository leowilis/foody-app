import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from '@/lib/api';
import { ORDER_API, ORDER_CONFIG } from '../constants/order.constants';
import { useMyOrders } from './useMyOrders';
import type { OrderStatus } from '../types';

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  isAuthenticated: vi.fn(),
}));

vi.mock('@/lib/api', () => ({
  api: {
    get: mocks.get,
  },
}));

vi.mock('@/features/auth/hooks/useIsAuthenticated', () => ({
  useIsAuthenticated: mocks.isAuthenticated,
}));

const myOrdersResponse = {
  success: true,
  data: {
    orders: [
      {
        id: 1,
        transactionId: 'TRX-001',
        status: 'done',
        paymentMethod: 'BNI Bank Negara Indonesia',
        deliveryAddress: 'Test Street, Medan',
        phone: '081234567890',
        pricing: {
          subtotal: 50_000,
          serviceFee: 1_000,
          deliveryFee: 10_000,
          totalPrice: 61_000,
        },
        restaurants: [
          {
            restaurant: {
              id: 10,
              name: 'Test Restaurant',
              logo: '/restaurant.jpg',
            },
            items: [
              {
                menuId: 20,
                menuName: 'Test Food',
                price: 25_000,
                image: '/food.jpg',
                quantity: 2,
                itemTotal: 50_000,
              },
            ],
            subtotal: 50_000,
          },
        ],
        createdAt: '2026-11-09T05:00:00.000Z',
        updatedAt: '2026-11-09T05:10:00.000Z',
      },
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    },
    filter: {
      status: 'done',
    },
  },
};

function setup() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return {
    queryClient,
    wrapper,
  };
}

describe('useMyOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.isAuthenticated.mockReturnValue(true);
    mocks.get.mockResolvedValue({
      data: myOrdersResponse,
    });
  });

  it('fetches orders using the requested status and pagination', async () => {
    const { wrapper } = setup();

    const { result } = renderHook(
      () => useMyOrders({ status: 'done', page: 1 }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(api.get).toHaveBeenCalledOnce();
    expect(api.get).toHaveBeenCalledWith(
      ORDER_API.MY_ORDERS,
      expect.objectContaining({
        params: {
          status: 'done',
          page: 1,
          limit: ORDER_CONFIG.defaultLimit,
        },
        signal: expect.any(AbortSignal),
      }),
    );

    expect(result.current.data).toEqual(myOrdersResponse);
  });

  it('uses default status and pagination when options are omitted', async () => {
    const { wrapper } = setup();

    const { result } = renderHook(() => useMyOrders(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(api.get).toHaveBeenCalledWith(
      ORDER_API.MY_ORDERS,
      expect.objectContaining({
        params: {
          status: 'done',
          page: ORDER_CONFIG.defaultPage,
          limit: ORDER_CONFIG.defaultLimit,
        },
      }),
    );
  });

  it('does not fetch orders when the user is unauthenticated', async () => {
    mocks.isAuthenticated.mockReturnValue(false);

    const { wrapper } = setup();

    const { result } = renderHook(() => useMyOrders(), { wrapper });

    expect(result.current.fetchStatus).toBe('idle');
    expect(result.current.isFetching).toBe(false);
    expect(api.get).not.toHaveBeenCalled();
  });

  it('keeps previous data when pagination changes with the same status', async () => {
    let resolveNextPage!: (value: { data: typeof myOrdersResponse }) => void;

    mocks.get
      .mockResolvedValueOnce({
        data: myOrdersResponse,
      })
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveNextPage = resolve;
        }),
      );

    const { wrapper } = setup();

    const { result, rerender } = renderHook(
      ({ page }) => useMyOrders({ status: 'done', page }),
      {
        wrapper,
        initialProps: { page: 1 },
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    rerender({ page: 2 });

    await waitFor(() => {
      expect(result.current.isPlaceholderData).toBe(true);
    });

    expect(result.current.data).toEqual(myOrdersResponse);

    await act(async () => {
      resolveNextPage({
        data: {
          ...myOrdersResponse,
          data: {
            ...myOrdersResponse.data,
            pagination: {
              ...myOrdersResponse.data.pagination,
              page: 2,
            },
          },
        },
      });
    });

    await waitFor(() => {
      expect(result.current.isPlaceholderData).toBe(false);
      expect(result.current.data?.data.pagination.page).toBe(2);
    });

    expect(api.get).toHaveBeenCalledTimes(2);
  });

  it('does not keep previous data when the status changes', async () => {
    let resolveNextStatus!: (value: { data: typeof myOrdersResponse }) => void;

    mocks.get
      .mockResolvedValueOnce({
        data: myOrdersResponse,
      })
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveNextStatus = resolve;
        }),
      );

    const initialProps: { status: OrderStatus } = {
      status: 'done',
    };

    const { wrapper } = setup();

    const { result, rerender } = renderHook(
      ({ status }) => useMyOrders({ status }),
      {
        initialProps,
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    rerender({ status: 'preparing' });

    await waitFor(() => {
      expect(result.current.data).toBeUndefined();
    });

    await act(async () => {
      resolveNextStatus({
        data: {
          ...myOrdersResponse,
          data: {
            ...myOrdersResponse.data,
            orders: [
              {
                ...myOrdersResponse.data.orders[0],
                status: 'preparing',
              },
            ],
            filter: {
              status: 'preparing',
            },
          },
        },
      });
    });

    await waitFor(() => {
      expect(result.current.data?.data.filter.status).toBe('preparing');
    });
  });

  it('rejects an invalid order history response', async () => {
    mocks.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          orders: [],
          pagination: {},
          filter: {
            status: 'invalid',
          },
        },
      },
    });

    const { wrapper } = setup();
    const { result } = renderHook(() => useMyOrders(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
});
