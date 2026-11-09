import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CHECKOUT_SUCCESS_STORAGE_KEY } from '@/config/storage.constants';
import { useCheckout } from './useCheckout';

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
  useIsMutating: vi.fn(),
  useMyCart: vi.fn(),
  useCurrentUser: vi.fn(),
  checkoutMutateAsync: vi.fn(),
  clearCartMutateAsync: vi.fn(),
}));

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>();

  return {
    ...actual,
    useIsMutating: mocks.useIsMutating,
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();

  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  };
});

vi.mock('sonner', () => ({
  toast: {
    success: mocks.toastSuccess,
    error: mocks.toastError,
  },
}));

vi.mock('@/features/cart/hooks/useMyCart', () => ({
  useMyCart: mocks.useMyCart,
}));

vi.mock('@/features/auth/hooks/useCurrentUser', () => ({
  useCurrentUser: mocks.useCurrentUser,
}));

vi.mock('@/features/order/hooks/useCheckoutMutation', () => ({
  useCheckoutMutation: () => ({
    isPending: false,
    mutateAsync: mocks.checkoutMutateAsync,
  }),
}));

vi.mock('@/features/cart/hooks/useClearCartMutation', () => ({
  useClearCartMutation: () => ({
    mutateAsync: mocks.clearCartMutateAsync,
  }),
}));

vi.mock('../constants/checkout.constants', () => ({
  BANK_OPTIONS: [
    {
      value: 'BNI Bank Negara Indonesia',
      label: 'Bank Negara Indonesia',
    },
  ],
  DELIVERY_FEE: 10_000,
  SERVICE_FEE: 1_000,
}));

const user = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  phone: '081234567890',
  avatar: null,
  latitude: null,
  longitude: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const cartGroups = [
  {
    restaurant: {
      id: 10,
      name: 'Test Restaurant',
    },
    items: [
      {
        menu: {
          id: 20,
        },
        quantity: 2,
      },
    ],
    subtotal: 50_000,
  },
];

const checkoutResponse = {
  data: {
    transaction: {
      transactionId: 'TRX-001',
      createdAt: '2026-11-09T05:00:00.000Z',
      paymentMethod: 'BNI Bank Negara Indonesia',
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
      pricing: {
        subtotal: 50_000,
        serviceFee: 1_000,
        deliveryFee: 10_000,
        totalPrice: 61_000,
      },
    },
  },
};

const checkoutPayload = {
  restaurants: [
    {
      restaurantId: 10,
      items: [
        {
          menuId: 20,
          quantity: 2,
        },
      ],
    },
  ],
  deliveryAddress: 'Test Street, Medan',
  phone: user.phone,
  paymentMethod: 'BNI Bank Negara Indonesia',
  notes: 'Please call before delivery',
};

function setup(
  options: {
    cartGroups?: typeof cartGroups;
    user?: typeof user | null;
    isUserLoading?: boolean;
    pendingCartMutations?: number;
  } = {},
) {
  mocks.useIsMutating.mockReturnValue(options.pendingCartMutations ?? 0);

  mocks.useMyCart.mockReturnValue({
    cartGroups: options.cartGroups ?? cartGroups,
    isLoading: false,
    isError: false,
    error: null,
    handleIncrease: vi.fn(),
    handleDecrease: vi.fn(),
    isItemPending: false,
  });

  mocks.useCurrentUser.mockReturnValue({
    data: options.user === undefined ? user : options.user,
    isLoading: options.isUserLoading ?? false,
  });

  mocks.checkoutMutateAsync.mockResolvedValue(checkoutResponse);
  mocks.clearCartMutateAsync.mockResolvedValue({
    success: true,
  });

  const hook = renderHook(() => useCheckout());

  act(() => {
    hook.result.current.setDeliveryAddress('  Test Street, Medan  ');
    hook.result.current.setNotes('  Please call before delivery  ');
  });

  return hook;
}

describe('useCheckout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('submits the checkout payload and navigates with the confirmed receipt', async () => {
    const { result } = setup();

    await act(async () => {
      await result.current.handleCheckout();
    });

    expect(mocks.checkoutMutateAsync).toHaveBeenCalledOnce();
    expect(mocks.checkoutMutateAsync).toHaveBeenCalledWith(checkoutPayload);

    expect(mocks.clearCartMutateAsync).toHaveBeenCalledOnce();

    expect(mocks.navigate).toHaveBeenCalledWith('/success', {
      state: {
        receipt: {
          transactionId: 'TRX-001',
          date: '2026-11-09T05:00:00.000Z',
          paymentMethod: 'BNI Bank Negara Indonesia',
          totalItems: 2,
          price: 50_000,
          deliveryFee: 10_000,
          serviceFee: 1_000,
          total: 61_000,
        },
      },
    });

    expect(
      JSON.parse(sessionStorage.getItem(CHECKOUT_SUCCESS_STORAGE_KEY)!),
    ).toEqual({
      transactionId: 'TRX-001',
      date: '2026-11-09T05:00:00.000Z',
      paymentMethod: 'BNI Bank Negara Indonesia',
      totalItems: 2,
      price: 50_000,
      deliveryFee: 10_000,
      serviceFee: 1_000,
      total: 61_000,
    });

    expect(mocks.toastSuccess).toHaveBeenCalledWith(
      'Order placed successfully!',
    );

    expect(result.current.isCheckoutPending).toBe(false);
  });

  it('keeps the order successful when clearing the cart fails', async () => {
    const { result } = setup();

    mocks.clearCartMutateAsync.mockRejectedValue(
      new Error('Unable to clear cart'),
    );

    await act(async () => {
      await result.current.handleCheckout();
    });

    expect(mocks.checkoutMutateAsync).toHaveBeenCalledOnce();
    expect(mocks.clearCartMutateAsync).toHaveBeenCalledOnce();

    expect(mocks.navigate).toHaveBeenCalledWith(
      '/success',
      expect.objectContaining({
        state: expect.objectContaining({
          receipt: expect.objectContaining({
            transactionId: 'TRX-001',
          }),
        }),
      }),
    );

    expect(mocks.toastError).toHaveBeenCalledWith(
      'Your order was placed, but your cart could not be cleared. Please refresh your cart before ordering again.',
    );

    expect(mocks.toastSuccess).toHaveBeenCalledWith(
      'Order placed successfully.',
    );

    expect(result.current.isCheckoutPending).toBe(false);
  });

  it('prevents duplicate checkout requests', async () => {
    let resolveCheckout!: (value: typeof checkoutResponse) => void;

    mocks.checkoutMutateAsync.mockReturnValue(
      new Promise((resolve) => {
        resolveCheckout = resolve;
      }),
    );

    const { result } = setup();

    let firstCheckout!: Promise<void>;
    let secondCheckout!: Promise<void>;

    act(() => {
      firstCheckout = result.current.handleCheckout();
      secondCheckout = result.current.handleCheckout();
    });

    expect(mocks.checkoutMutateAsync).toHaveBeenCalledOnce();
    expect(result.current.isCheckoutPending).toBe(true);

    await act(async () => {
      await secondCheckout;
    });

    expect(mocks.checkoutMutateAsync).toHaveBeenCalledOnce();

    await act(async () => {
      resolveCheckout(checkoutResponse);
      await firstCheckout;
    });

    expect(mocks.checkoutMutateAsync).toHaveBeenCalledOnce();
    expect(mocks.navigate).toHaveBeenCalledOnce();
    expect(result.current.isCheckoutPending).toBe(false);
  });

  it('shows an error and does not clear the cart when checkout fails', async () => {
    const { result } = setup();

    mocks.checkoutMutateAsync.mockRejectedValue(
      new Error('Payment request failed'),
    );

    await act(async () => {
      await result.current.handleCheckout();
    });

    expect(result.current.errorOpen).toBe(true);
    expect(result.current.errorMessage).toBe('Payment request failed');

    expect(mocks.clearCartMutateAsync).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();
    expect(result.current.isCheckoutPending).toBe(false);
  });

  it('rejects checkout when the delivery address is empty', async () => {
    const { result } = setup();

    act(() => {
      result.current.setDeliveryAddress('   ');
    });

    await act(async () => {
      await result.current.handleCheckout();
    });

    expect(result.current.errorOpen).toBe(true);
    expect(result.current.errorMessage).toBe('Delivery address is required.');

    expect(mocks.checkoutMutateAsync).not.toHaveBeenCalled();
  });

  it('rejects checkout when the cart is empty', async () => {
    const { result } = setup({ cartGroups: [] });

    await act(async () => {
      await result.current.handleCheckout();
    });

    expect(result.current.errorOpen).toBe(true);
    expect(result.current.errorMessage).toBe(
      'Your cart is empty. Add items before checkout.',
    );

    expect(mocks.checkoutMutateAsync).not.toHaveBeenCalled();
    expect(mocks.clearCartMutateAsync).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it('rejects checkout when the user has no phone number', async () => {
    const { result } = setup({
      user: { ...user, phone: '' },
    });

    await act(async () => {
      await result.current.handleCheckout();
    });

    expect(result.current.errorOpen).toBe(true);
    expect(result.current.errorMessage).toBe(
      'Phone number is required for checkout.',
    );

    expect(mocks.checkoutMutateAsync).not.toHaveBeenCalled();
    expect(mocks.clearCartMutateAsync).not.toHaveBeenCalled();
  });

  it('rejects checkout when the payment method is invalid', async () => {
    const { result } = setup();

    act(() => {
      result.current.setPaymentMethod('Unsupported Payment Method');
    });

    await act(async () => {
      await result.current.handleCheckout();
    });

    expect(result.current.errorOpen).toBe(true);
    expect(result.current.errorMessage).toBe(
      'Please select a valid payment method.',
    );

    expect(mocks.checkoutMutateAsync).not.toHaveBeenCalled();
    expect(mocks.clearCartMutateAsync).not.toHaveBeenCalled();
  });

  it('does not submit checkout while cart mutations are pending', async () => {
    const { result } = setup({ pendingCartMutations: 1 });

    await act(async () => {
      await result.current.handleCheckout();
    });

    expect(result.current.isCartMutationPending).toBe(true);
    expect(result.current.isCheckoutPending).toBe(false);
    expect(result.current.errorOpen).toBe(false);

    expect(mocks.checkoutMutateAsync).not.toHaveBeenCalled();
    expect(mocks.clearCartMutateAsync).not.toHaveBeenCalled();
  });

  it('does not submit checkout while user data is loading', async () => {
    const { result } = setup({ isUserLoading: true });

    await act(async () => {
      await result.current.handleCheckout();
    });

    expect(result.current.isUserLoading).toBe(true);
    expect(result.current.isCheckoutPending).toBe(false);
    expect(result.current.errorOpen).toBe(false);

    expect(mocks.checkoutMutateAsync).not.toHaveBeenCalled();
    expect(mocks.clearCartMutateAsync).not.toHaveBeenCalled();
  });
});
