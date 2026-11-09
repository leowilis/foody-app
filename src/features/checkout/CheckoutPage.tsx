import CheckoutEmpty from './components/CheckoutEmpty';
import CheckoutGroup from './components/CheckoutGroup';
import DeliveryAddress from './components/DeliveryAddress';
import OrderNotes from './components/OrderNotes';
import PaymentMethod from './components/PaymentMethod';
import PaymentSummary from './components/PaymentSummary';
import { useCheckout } from './hooks/useCheckout';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Renders the checkout flow for reviewing items and placing an order.
export default function CheckoutPage() {
  const {
    cartGroups,
    isCartLoading,
    isCartError,
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
    errorOpen,
    setErrorOpen,
    errorMessage,
    isUserLoading,
    isItemPending,
    isCartMutationPending,
    isCheckoutPending,
    handleIncrease,
    handleDecrease,
    handleCheckout,
  } = useCheckout();

  if (isCartLoading) {
    return (
      <section className='mt-16 flex w-full flex-col items-center gap-4 px-4 pb-12 pt-4 text-text md:mt-32 md:gap-6 md:px-30 md:pb-25 md:pt-0'>
        <div className='flex w-full flex-col gap-4 md:w-250 md:gap-6'>
          <h1 className='text-2xl font-extrabold leading-9 md:text-[32px] md:leading-10.5'>
            Checkout
          </h1>

          <p className='text-text-secondary' role='status'>
            Loading your cart...
          </p>
        </div>
      </section>
    );
  }

  if (isCartError) {
    return (
      <section className='mt-16 flex w-full flex-col items-center gap-4 px-4 pb-12 pt-4 text-text md:mt-32 md:gap-6 md:px-30 md:pb-25 md:pt-0'>
        <div className='flex w-full flex-col gap-4 md:w-250 md:gap-6'>
          <h1 className='text-2xl font-extrabold leading-9 md:text-[32px] md:leading-10.5'>
            Checkout
          </h1>

          <p role='alert'>Unable to load your cart. Please try again.</p>
        </div>
      </section>
    );
  }

  if (cartGroups.length === 0) {
    return (
      <section className='mt-16 flex w-full flex-col items-center gap-4 px-4 pb-12 pt-4 text-text md:mt-32 md:gap-6 md:px-30 md:pb-25 md:pt-0'>
        <div className='flex w-full flex-col gap-4 md:w-250 md:gap-6'>
          <h1 className='text-2xl font-extrabold leading-9 md:text-[32px] md:leading-10.5'>
            Checkout
          </h1>

          {/* Show the empty state when there are no items to review. */}
          <CheckoutEmpty />
        </div>
      </section>
    );
  }

  return (
    <section className='mt-16 flex w-full flex-col items-center gap-4 px-4 pb-12 pt-4 text-text md:mt-32 md:gap-6 md:px-30 md:pb-25 md:pt-0'>
      <div className='flex w-full flex-col gap-4 md:w-250 md:gap-6'>
        <h1 className='text-2xl font-extrabold leading-9 md:text-[32px] md:leading-10.5'>
          Checkout
        </h1>

        <div className='flex flex-col gap-4 md:flex-row md:items-start md:gap-5'>
          {/* Review delivery details and selected food items. */}
          <div className='flex min-w-0 flex-col gap-4 md:flex-1'>
            <DeliveryAddress
              value={deliveryAddress}
              phone={user?.phone ?? ''}
              isUserLoading={isUserLoading}
              onChange={setDeliveryAddress}
            />

            {/* Collect optional instructions for the order. */}
            <OrderNotes value={notes} onChange={setNotes} />

            {cartGroups.map((group) => (
              <CheckoutGroup
                key={group.restaurant.id}
                group={group}
                isItemPending={isItemPending}
                isCheckoutPending={isCheckoutPending}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
              />
            ))}
          </div>

          {/* Review payment details and place the order. */}
          <div className='flex w-full flex-col gap-5 rounded-3xl border border-border bg-surface p-4 shadow-foody-md md:sticky md:top-24 md:w-96 md:shrink-0 md:p-5'>
            <PaymentMethod value={paymentMethod} onChange={setPaymentMethod} />

            <div className='border-t border-dashed border-border' />

            <PaymentSummary
              totalItems={totalItems}
              totalPrice={totalPrice}
              grandTotal={grandTotal}
              isPending={isCheckoutPending}
              isCartMutationPending={isCartMutationPending}
              isUserLoading={isUserLoading}
              isEmpty={cartGroups.length === 0}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>

      {/* Show checkout errors without leaving the current page. */}
      <Dialog open={errorOpen} onOpenChange={setErrorOpen}>
        <DialogContent className='rounded-2xl border-border bg-surface text-text'>
          <DialogHeader>
            <DialogTitle>Checkout failed</DialogTitle>

            <DialogDescription className='text-text-secondary'>
              {errorMessage}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
}
