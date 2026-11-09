import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/lib/format';
import { DELIVERY_FEE, SERVICE_FEE } from '../constants/checkout.constants';

interface PaymentSummaryProps {
  totalItems: number;
  totalPrice: number;
  grandTotal: number;
  isPending: boolean;
  isCartMutationPending: boolean;
  isUserLoading: boolean;
  isEmpty: boolean;
  onCheckout: () => void;
}

// Shows the order cost breakdown and checkout action.
export default function PaymentSummary({
  totalItems,
  totalPrice,
  grandTotal,
  isPending,
  isCartMutationPending,
  isUserLoading,
  isEmpty,
  onCheckout,
}: PaymentSummaryProps) {
  const isCheckoutDisabled =
    isPending || isCartMutationPending || isUserLoading || isEmpty;

  return (
    <div className='flex flex-col gap-4 md:gap-5'>
      <h2 className='text-base font-extrabold leading-7.5 -tracking-[0.02em] text-text md:text-lg md:leading-8'>
        Payment Summary
      </h2>

      {/* Show the individual order charges. */}
      <div className='flex flex-col gap-3'>
        <div className='flex flex-row justify-between gap-4'>
          <span className='text-sm font-medium leading-7 -tracking-[0.03em] text-text-secondary md:text-base md:leading-7.5'>
            Price ({totalItems} items)
          </span>

          <span className='shrink-0 text-sm font-bold leading-7 -tracking-[0.02em] text-text md:text-base md:leading-7.5'>
            {formatRupiah(totalPrice)}
          </span>
        </div>

        <div className='flex flex-row justify-between gap-4'>
          <span className='text-sm font-medium leading-7 -tracking-[0.03em] text-text-secondary md:text-base md:leading-7.5'>
            Delivery Fee
          </span>

          <span className='shrink-0 text-sm font-bold leading-7 -tracking-[0.02em] text-text md:text-base md:leading-7.5'>
            {formatRupiah(DELIVERY_FEE)}
          </span>
        </div>

        <div className='flex flex-row justify-between gap-4'>
          <span className='text-sm font-medium leading-7 -tracking-[0.03em] text-text-secondary md:text-base md:leading-7.5'>
            Service Fee
          </span>

          <span className='shrink-0 text-sm font-bold leading-7 -tracking-[0.02em] text-text md:text-base md:leading-7.5'>
            {formatRupiah(SERVICE_FEE)}
          </span>
        </div>
      </div>

      {/* Highlight the final amount before checkout. */}
      <div className='border-t border-dashed border-border-strong pt-4'>
        <div className='flex flex-row items-center justify-between gap-4'>
          <span className='text-base font-bold leading-7.5 -tracking-[0.02em] text-text md:text-lg md:leading-8'>
            Total
          </span>

          <span className='shrink-0 text-lg font-extrabold leading-8 -tracking-[0.02em] text-text md:text-xl md:leading-8.5'>
            {formatRupiah(grandTotal)}
          </span>
        </div>
      </div>

      {/* Submit the order after all checkout details are ready. */}
      <Button
        type='button'
        onClick={onCheckout}
        disabled={isCheckoutDisabled}
        className='h-11 w-full cursor-pointer rounded-pill bg-primary-100 text-base font-bold leading-7.5 text-primary-foreground -tracking-[0.02em] transition-colors hover:bg-primary-200 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60 md:h-12'
      >
        {isPending ? 'Processing...' : 'Buy'}
      </Button>
    </div>
  );
}
