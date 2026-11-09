import { useRef, useState } from 'react';
import { useIsMutating } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CART_QUERY_KEY } from '@/features/cart/constants/cart.constants';
import { useMyCart } from '@/features/cart/hooks/useMyCart';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import {
  BANK_OPTIONS,
  DELIVERY_FEE,
  SERVICE_FEE,
} from '../constants/checkout.constants';
import { useCheckoutMutation } from '@/features/order/hooks/useCheckoutMutation';
import { useClearCartMutation } from '@/features/cart/hooks/useClearCartMutation';
import { CHECKOUT_SUCCESS_STORAGE_KEY } from '@/config/storage.constants';

// Manages checkout state and submits the current cart as an order.
export function useCheckout() {
  const navigate = useNavigate();
  const checkoutInProgress = useRef(false);
  const clearCartMutation = useClearCartMutation();
  const pendingCartMutations = useIsMutating({
    mutationKey: CART_QUERY_KEY,
  });

  const {
    cartGroups,
    isLoading: isCartLoading,
    isError: isCartError,
    error: cartError,
    handleIncrease,
    handleDecrease,
    isItemPending,
  } = useMyCart();

  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const checkoutMutation = useCheckoutMutation();
  const [isCheckoutPending, setIsCheckoutPending] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(
    BANK_OPTIONS[0]?.value ?? '',
  );
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('There is an error.');

  const totalItems = cartGroups.reduce(
    (sum, group) =>
      sum +
      group.items.reduce((groupTotal, item) => groupTotal + item.quantity, 0),
    0,
  );

  const totalPrice = cartGroups.reduce((sum, group) => sum + group.subtotal, 0);
  const grandTotal = totalPrice + DELIVERY_FEE + SERVICE_FEE;

  const handleCheckout = async () => {
    if (
      checkoutInProgress.current ||
      checkoutMutation.isPending ||
      pendingCartMutations > 0 ||
      isUserLoading
    ) {
      return;
    }

    if (cartGroups.length === 0) {
      setErrorMessage('Your cart is empty. Add items before checkout.');
      setErrorOpen(true);
      return;
    }

    if (!user?.phone) {
      setErrorMessage('Phone number is required for checkout.');
      setErrorOpen(true);
      return;
    }

    if (!deliveryAddress.trim()) {
      setErrorMessage('Delivery address is required.');
      setErrorOpen(true);
      return;
    }

    const isValidPaymentMethod = BANK_OPTIONS.some(
      (option) => option.value === paymentMethod,
    );

    if (!isValidPaymentMethod) {
      setErrorMessage('Please select a valid payment method.');
      setErrorOpen(true);
      return;
    }

    try {
      sessionStorage.removeItem(CHECKOUT_SUCCESS_STORAGE_KEY);
    } catch {
      // Ignore storage errors.
    }

    checkoutInProgress.current = true;
    setIsCheckoutPending(true);

    try {
      let response;

      try {
        response = await checkoutMutation.mutateAsync({
          restaurants: cartGroups.map((group) => ({
            restaurantId: group.restaurant.id,
            items: group.items.map((item) => ({
              menuId: item.menu.id,
              quantity: item.quantity,
            })),
          })),
          deliveryAddress: deliveryAddress.trim(),
          phone: user.phone,
          paymentMethod,
          notes: notes.trim(),
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Unable to place your order. Please try again.',
        );
        setErrorOpen(true);
        return;
      }

      const { transaction } = response.data;

      const confirmedTotalItems = transaction.restaurants.reduce(
        (sum, restaurant) =>
          sum +
          restaurant.items.reduce(
            (restaurantTotal, item) => restaurantTotal + item.quantity,
            0,
          ),
        0,
      );

      const receipt = {
        transactionId: transaction.transactionId,
        date: transaction.createdAt,
        paymentMethod: transaction.paymentMethod,
        totalItems: confirmedTotalItems,
        price: transaction.pricing.subtotal,
        deliveryFee: transaction.pricing.deliveryFee,
        serviceFee: transaction.pricing.serviceFee,
        total: transaction.pricing.totalPrice,
      };

      try {
        sessionStorage.setItem(
          CHECKOUT_SUCCESS_STORAGE_KEY,
          JSON.stringify(receipt),
        );
      } catch {
        // The receipt is still available through navigation state.
      }

      let cartCleared = false;

      try {
        await clearCartMutation.mutateAsync();
        cartCleared = true;
      } catch {
        toast.error(
          'Your order was placed, but your cart could not be cleared. Please refresh your cart before ordering again.',
        );
      }

      navigate('/success', { state: { receipt } });

      toast.success(
        cartCleared
          ? 'Order placed successfully!'
          : 'Order placed successfully.',
      );
    } finally {
      checkoutInProgress.current = false;
      setIsCheckoutPending(false);
    }
  };

  return {
    cartGroups,
    isCartLoading,
    isCartError,
    cartError,
    totalItems,
    totalPrice,
    grandTotal,
    paymentMethod,
    setPaymentMethod,
    deliveryAddress,
    setDeliveryAddress,
    notes,
    setNotes,
    user,
    isUserLoading,
    errorOpen,
    setErrorOpen,
    errorMessage,
    isItemPending,
    isCartMutationPending: pendingCartMutations > 0,
    isCheckoutPending,
    handleCheckout,
    handleIncrease,
    handleDecrease,
  };
}
