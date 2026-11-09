import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import greenChecked from '@/assets/green-checked.svg';
import logoFoody from '@/assets/logo-foody.svg';
import { Button } from '@/components/ui/button';
import { formatDate, formatRupiah } from '@/lib/format';
import { CHECKOUT_SUCCESS_STORAGE_KEY } from '@/config/storage.constants';

type SuccessPayload = {
  readonly transactionId: string;
  readonly date: string;
  readonly paymentMethod: string;
  readonly totalItems: number;
  readonly price: number;
  readonly deliveryFee: number;
  readonly serviceFee: number;
  readonly total: number;
};

// Validates the structure and values of a checkout receipt.
function isSuccessPayload(payload: unknown): payload is SuccessPayload {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const candidate = payload as Record<string, unknown>;

  const isNonEmptyString = (value: unknown): value is string =>
    typeof value === 'string' && value.trim().length > 0;

  const isValidAmount = (value: unknown): value is number =>
    typeof value === 'number' && Number.isFinite(value) && value >= 0;

  if (
    !isNonEmptyString(candidate.transactionId) ||
    !isNonEmptyString(candidate.date) ||
    Number.isNaN(Date.parse(candidate.date)) ||
    !isNonEmptyString(candidate.paymentMethod) ||
    typeof candidate.totalItems !== 'number' ||
    !Number.isInteger(candidate.totalItems) ||
    candidate.totalItems <= 0 ||
    !isValidAmount(candidate.price) ||
    !isValidAmount(candidate.deliveryFee) ||
    !isValidAmount(candidate.serviceFee) ||
    !isValidAmount(candidate.total)
  ) {
    return false;
  }

  return true;
}

// Reads the receipt from navigation state or persisted session storage.

function getSuccessPayload(navigationState: unknown): SuccessPayload | null {
  if (
    navigationState &&
    typeof navigationState === 'object' &&
    'receipt' in navigationState &&
    isSuccessPayload(navigationState.receipt)
  ) {
    return navigationState.receipt;
  }

  try {
    const raw = sessionStorage.getItem(CHECKOUT_SUCCESS_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const payload: unknown = JSON.parse(raw);

    return isSuccessPayload(payload) ? payload : null;
  } catch {
    return null;
  }
}

function clearStoredReceipt() {
  try {
    sessionStorage.removeItem(CHECKOUT_SUCCESS_STORAGE_KEY);
  } catch {
    // Ignore storage errors.
  }
}

// Shows the confirmed order receipt after a successful checkout.
export default function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const payload = getSuccessPayload(location.state);

  if (!payload) {
    return <Navigate to='/myorders' replace />;
  }

  const receiptRows = [
    {
      label: 'Order ID',
      value: payload.transactionId,
    },
    {
      label: 'Date',
      value: formatDate(payload.date),
    },
    {
      label: 'Payment Method',
      value: payload.paymentMethod,
    },
    {
      label: `Price (${payload.totalItems} items)`,
      value: formatRupiah(payload.price),
    },
    {
      label: 'Delivery Fee',
      value: formatRupiah(payload.deliveryFee),
    },
    {
      label: 'Service Fee',
      value: formatRupiah(payload.serviceFee),
    },
  ];

  return (
    <section className='flex min-h-screen w-full flex-col items-center justify-center gap-7 bg-background px-4 py-8 text-text'>
      {/* Return to the home page from the Foody logo. */}
      <button
        type='button'
        onClick={() => {
          clearStoredReceipt();
          navigate('/', { replace: true });
        }}
        className='flex cursor-pointer items-center gap-3'
        aria-label='Go to Foody home'
      >
        <img
          src={logoFoody}
          alt='Foody'
          className='h-7 w-7 md:h-10.5 md:w-10.5'
        />
        <span className='text-2xl font-extrabold leading-10.5 md:text-[32px]'>
          Foody
        </span>
      </button>

      <section className='relative flex w-full flex-col gap-4 rounded-3xl border border-border bg-surface px-4 py-5 shadow-foody-md md:w-107 md:px-5 md:py-6'>
        {/* Confirm that the order was placed successfully. */}
        <div className='flex flex-col items-center gap-1 text-center'>
          <img
            src={greenChecked}
            alt=''
            aria-hidden='true'
            className='h-16 w-16'
          />
          <h1 className='text-lg font-extrabold leading-8 -tracking-[0.02em] md:text-xl md:leading-8.5'>
            Payment Success
          </h1>
          <p className='text-sm leading-7 -tracking-[0.02em] text-text-secondary md:text-base md:leading-7.5'>
            Your order has been placed successfully.
          </p>
        </div>

        {/* Show the payment receipt details. */}
        <div className='relative mt-4 border-t border-dashed border-border pt-4'>
          <span
            aria-hidden='true'
            className='absolute -left-4 top-0 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background'
          />
          <span
            aria-hidden='true'
            className='absolute -right-4 top-0 h-5 w-5 translate-x-1/2 -translate-y-1/2 rounded-full bg-background'
          />
          <div className='flex flex-col gap-4'>
            {receiptRows.map(({ label, value }) => (
              <div
                key={label}
                className='flex items-center justify-between gap-4'
              >
                <span className='text-sm font-medium leading-7 text-text-secondary'>
                  {label}
                </span>
                <span className='text-right text-sm font-semibold leading-7 -tracking-[0.02em] md:text-base md:leading-7.5'>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Highlight the final order total. */}
        <div className='relative mt-4 border-t border-dashed border-border pt-4'>
          <span
            aria-hidden='true'
            className='absolute -left-4 top-0 h-5 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background'
          />
          <span
            aria-hidden='true'
            className='absolute -right-4 top-0 h-5 w-4 translate-x-1/2 -translate-y-1/2 rounded-full bg-background'
          />
          <div className='flex items-center justify-between gap-4'>
            <span className='text-base font-semibold leading-7.5 -tracking-[0.02em] md:text-lg md:leading-8'>
              Total
            </span>
            <span className='text-base font-extrabold leading-7.5 -tracking-[0.02em] md:text-lg md:leading-8'>
              {formatRupiah(payload.total)}
            </span>
          </div>
        </div>

        {/* Take the customer to their order history. */}
        <Button
          type='button'
          onClick={() => {
            clearStoredReceipt();
            navigate('/myorders', { replace: true });
          }}
          className='mt-4 h-11 w-full cursor-pointer rounded-pill bg-primary-100 text-base font-bold leading-7.5 text-primary-foreground -tracking-[0.02em] transition-colors hover:bg-primary-200 md:h-12'
        >
          See My Orders
        </Button>
      </section>
    </section>
  );
}
