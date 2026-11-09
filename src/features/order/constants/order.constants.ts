export const ORDER_API = {
  CHECKOUT: '/api/order/checkout',
  MY_ORDERS: '/api/order/my-order',
} as const;

export const ORDER_CONFIG = {
  defaultPage: 1,
  defaultLimit: 10,
} as const;

export const ORDER_STATUSES = [
  'preparing',
  'on_the_way',
  'delivered',
  'done',
  'cancelled',
] as const;

export const ORDER_STATUS_LABELS: Record<
  (typeof ORDER_STATUSES)[number],
  string
> = {
  preparing: 'Preparing',
  on_the_way: 'On the way',
  delivered: 'Delivered',
  done: 'Completed',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_STYLES: Record<
  (typeof ORDER_STATUSES)[number],
  string
> = {
  preparing: 'bg-warning/10 text-warning',
  on_the_way: 'bg-info/10 text-info',
  delivered: 'bg-success/10 text-success',
  done: 'bg-primary-100/10 text-primary-100',
  cancelled: 'bg-error/10 text-error',
};

// React Query keys used for order-related server state.
export const ORDER_QUERY_KEYS = {
  MY_ORDERS: ['orders', 'my-orders'] as const,
} as const;
