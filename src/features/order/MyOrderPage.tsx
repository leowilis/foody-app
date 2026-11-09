import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { getErrorMessage } from '@/lib/api-helpers';
import OrderCard from './components/OrderCard';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUSES,
} from './constants/order.constants';
import { useMyOrders } from './hooks/useMyOrders';
import type { OrderStatus } from './types';

// Shows the user's order history with status filters and pagination.
export default function MyOrdersPage() {
  const [status, setStatus] = useState<OrderStatus>('done');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch, isFetching } = useMyOrders({
    status,
    page,
  });

  const orders = data?.data.orders ?? [];
  const pagination = data?.data.pagination;
  const isUpdating = isFetching && !isLoading;

  const handleStatusChange = (nextStatus: OrderStatus) => {
    setStatus(nextStatus);
    setPage(1);
  };

  return (
    <section className='mb-12 mt-16 flex w-full flex-col items-center gap-4 px-4 pt-4 text-text md:mb-25 md:mt-32 md:gap-8 md:px-30 md:pt-0'>
      <div className='flex w-full flex-col gap-4 md:w-250 md:gap-8'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-2xl font-extrabold leading-9 md:text-[32px] md:leading-10.5'>
            My Orders
          </h1>

          <div
            role='group'
            aria-label='Filter orders by status'
            className='flex gap-2 overflow-x-auto pb-1'
          >
            {ORDER_STATUSES.map((orderStatus) => {
              const isActive = status === orderStatus;

              return (
                <button
                  key={orderStatus}
                  type='button'
                  aria-pressed={isActive}
                  onClick={() => handleStatusChange(orderStatus)}
                  disabled={isFetching && isActive}
                  className={`shrink-0 rounded-pill border px-4 py-2 text-sm font-bold capitalize transition-colors ${
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-surface text-text-secondary hover:border-border-strong hover:text-text'
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {ORDER_STATUS_LABELS[orderStatus]}
                </button>
              );
            })}
          </div>
        </div>

        {isUpdating && !isError && (
          <p
            role='status'
            aria-live='polite'
            className='text-sm text-text-secondary'
          >
            Updating orders...
          </p>
        )}

        {isLoading && (
          <div role='status' aria-live='polite' className='flex flex-col gap-4'>
            <Skeleton
              variant='rectangular'
              className='h-40 w-full rounded-3xl'
            />
            <Skeleton
              variant='rectangular'
              className='h-40 w-full rounded-3xl'
            />
          </div>
        )}

        {isError && (
          <Alert variant='destructive'>
            <AlertTitle>Failed to load orders</AlertTitle>

            <AlertDescription className='flex flex-col gap-3'>
              <span>{getErrorMessage(error)}</span>

              <button
                type='button'
                onClick={() => refetch()}
                disabled={isFetching}
                className='w-fit rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {isFetching ? 'Retrying…' : 'Try again'}
              </button>
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && orders.length === 0 && (
          <div className='flex flex-col items-center justify-center rounded-3xl border border-border bg-surface px-4 py-12 text-center shadow-foody-md'>
            <h2 className='text-lg font-extrabold text-text'>
              No {ORDER_STATUS_LABELS[status].toLowerCase()} orders
            </h2>

            <p className='mt-1 text-sm font-medium text-text-secondary'>
              Orders with this status will appear here.
            </p>
          </div>
        )}

        {!isLoading && !isError && orders.length > 0 && (
          <div className='flex flex-col gap-4'>
            {orders.map((order) => (
              <OrderCard key={order.transactionId} order={order} />
            ))}
          </div>
        )}

        {!isLoading && !isError && pagination && pagination.totalPages > 1 && (
          <nav
            aria-label='Order history pagination'
            className='flex items-center justify-center gap-4 pt-2'
          >
            <button
              type='button'
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((currentPage) => currentPage - 1)}
              className='rounded-xl border border-border bg-surface px-4 py-2 text-sm font-bold text-text transition-colors hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-40'
            >
              Previous
            </button>

            <span
              aria-live='polite'
              className='text-sm font-semibold text-text-secondary'
            >
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              type='button'
              disabled={page >= pagination.totalPages || isFetching}
              onClick={() => setPage((currentPage) => currentPage + 1)}
              className='rounded-xl border border-border bg-surface px-4 py-2 text-sm font-bold text-text transition-colors hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-40'
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
