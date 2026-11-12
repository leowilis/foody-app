import { formatRupiah } from '@/lib/format';
import restaurantPlaceholder from '@/assets/icon-restaurant-dummy.webp';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
} from '../constants/order.constants';
import type { MyOrder } from '../types';

interface OrderCardProps {
  order: MyOrder;
}

// Displays a single order with its items and payment details.
export default function OrderCard({ order }: OrderCardProps) {
  const { pricing } = order;
  const statusLabel = ORDER_STATUS_LABELS[order.status];
  const statusStyle = ORDER_STATUS_STYLES[order.status];

  return (
    <article className='flex flex-col gap-4 rounded-3xl border border-border bg-surface p-4 shadow-foody-md md:gap-5 md:p-5'>
      <div className='flex flex-col gap-2 md:flex-row md:items-start md:justify-between'>
        <div className='flex min-w-0 flex-col gap-1'>
          <span className='text-xs font-semibold uppercase tracking-[0.08em] text-text-muted'>
            Order
          </span>
          <h2 className='truncate text-base font-extrabold leading-7.5 text-text md:text-lg'>
            #{order.transactionId}
          </h2>
        </div>

        <span
          className={`w-fit rounded-pill px-3 py-1 text-xs font-bold ${statusStyle}`}
        >
          {statusLabel}
        </span>
      </div>

      <div className='flex flex-col gap-4'>
        {order.restaurants.map((restaurantOrder) => (
          <div
            key={restaurantOrder.restaurant.id}
            className='flex flex-col gap-3 rounded-2xl border border-border bg-surface-subtle p-3 md:p-4'
          >
            <div className='flex min-w-0 items-center gap-2'>
              <img
                src={restaurantOrder.restaurant.logo || restaurantPlaceholder}
                alt={restaurantOrder.restaurant.name}
                loading='lazy'
                decoding='async'
                onError={(event) => {
                  const image = event.currentTarget;

                  image.onerror = null;
                  image.src = restaurantPlaceholder;
                }}
                className='h-9 w-9 shrink-0 rounded-xl object-cover'
              />

              <h3 className='truncate text-sm font-bold text-text md:text-base'>
                {restaurantOrder.restaurant.name}
              </h3>
            </div>

            <div className='flex flex-col gap-3'>
              {restaurantOrder.items.map((item) => (
                <div
                  key={`${restaurantOrder.restaurant.id}-${item.menuId}`}
                  className='flex items-start justify-between gap-4'
                >
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-semibold text-text'>
                      {item.menuName}
                    </p>
                    <p className='text-xs font-medium text-text-secondary'>
                      {item.quantity} × {formatRupiah(item.price)}
                    </p>
                  </div>

                  <span className='shrink-0 text-sm font-bold text-text'>
                    {formatRupiah(item.itemTotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className='flex items-center justify-between border-t border-dashed border-border pt-3'>
              <span className='text-sm font-semibold text-text-secondary'>
                Restaurant subtotal
              </span>
              <span className='text-sm font-extrabold text-text'>
                {formatRupiah(restaurantOrder.subtotal)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className='flex flex-col gap-2 border-t border-dashed border-border pt-4'>
        <div className='flex items-start justify-between gap-4'>
          <span className='text-sm font-medium text-text-secondary'>
            Payment
          </span>
          <span className='text-right text-sm font-semibold text-text'>
            {order.paymentMethod}
          </span>
        </div>

        <div className='flex items-start justify-between gap-4'>
          <span className='text-sm font-medium text-text-secondary'>
            Delivery address
          </span>
          <span className='max-w-[65%] text-right text-sm font-semibold text-text'>
            {order.deliveryAddress}
          </span>
        </div>

        <div className='flex items-start justify-between gap-4'>
          <span className='text-sm font-medium text-text-secondary'>Phone</span>
          <span className='text-right text-sm font-semibold text-text'>
            {order.phone}
          </span>
        </div>
      </div>

      <div className='flex flex-col gap-2 border-t border-dashed border-border pt-4'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-medium text-text-secondary'>
            Subtotal
          </span>
          <span className='text-sm font-semibold text-text'>
            {formatRupiah(pricing.subtotal)}
          </span>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-sm font-medium text-text-secondary'>
            Service fee
          </span>
          <span className='text-sm font-semibold text-text'>
            {formatRupiah(pricing.serviceFee)}
          </span>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-sm font-medium text-text-secondary'>
            Delivery fee
          </span>
          <span className='text-sm font-semibold text-text'>
            {formatRupiah(pricing.deliveryFee)}
          </span>
        </div>

        <div className='flex items-center justify-between border-t border-border pt-3'>
          <span className='text-base font-extrabold text-text'>Total</span>
          <span className='text-lg font-extrabold text-primary-100'>
            {formatRupiah(pricing.totalPrice)}
          </span>
        </div>
      </div>
    </article>
  );
}
