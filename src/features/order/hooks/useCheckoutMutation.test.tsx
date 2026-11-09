import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from '@/lib/api';
import { ORDER_API, ORDER_QUERY_KEYS } from '../constants/order.constants';
import { useCheckoutMutation } from './useCheckoutMutation';

const mocks = vi.hoisted(() => ({
  post: vi.fn(),
}));

vi.mock('@/lib/api', () => ({
  api: {
    post: mocks.post,
  },
}));

const checkoutPayload = {
  restaurants: [
    {
      restaurantId: 10,
      items: [{ menuId: 20, quantity: 2 }],
    },
  ],
  deliveryAddress: 'Test Street, Medan',
  phone: '081234567890',
  paymentMethod: 'BNI Bank Negara Indonesia',
  notes: 'Please call before delivery',
};

const checkoutResponse = {
  success: true,
  message: 'Order placed successfully',
  data: {
    transaction: {
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
              quantity: 2,
              itemTotal: 50_000,
            },
          ],
          subtotal: 50_000,
        },
      ],
      createdAt: '2026-11-09T05:00:00.000Z',
    },
  },
};

function setup() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const hook = renderHook(() => useCheckoutMutation(), { wrapper });

  return {
    ...hook,
    queryClient,
    invalidateQueries,
  };
}

describe('useCheckoutMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits the checkout payload and returns the validated response', async () => {
    mocks.post.mockResolvedValue({
      data: checkoutResponse,
    });

    const { result } = setup();
    let response!: typeof checkoutResponse;

    await act(async () => {
      response = await result.current.mutateAsync(checkoutPayload);
    });

    expect(api.post).toHaveBeenCalledOnce();
    expect(api.post).toHaveBeenCalledWith(ORDER_API.CHECKOUT, checkoutPayload);
    expect(response).toEqual(checkoutResponse);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('invalidates the order history after successful checkout', async () => {
    mocks.post.mockResolvedValue({
      data: checkoutResponse,
    });

    const { result, invalidateQueries } = setup();

    await act(async () => {
      await result.current.mutateAsync(checkoutPayload);
    });

    await waitFor(() => {
      expect(invalidateQueries).toHaveBeenCalledWith({
        queryKey: ORDER_QUERY_KEYS.MY_ORDERS,
      });
    });
  });

  it('rejects an invalid checkout response', async () => {
    mocks.post.mockResolvedValue({
      data: {
        success: true,
        data: {},
      },
    });

    const { result } = setup();

    await act(async () => {
      await expect(
        result.current.mutateAsync(checkoutPayload),
      ).rejects.toThrow();
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it('does not invalidate order history when checkout fails', async () => {
    mocks.post.mockRejectedValue(new Error('Payment request failed'));

    const { result, invalidateQueries } = setup();

    await act(async () => {
      await expect(result.current.mutateAsync(checkoutPayload)).rejects.toThrow(
        'Payment request failed',
      );
    });

    expect(invalidateQueries).not.toHaveBeenCalled();
  });
});
