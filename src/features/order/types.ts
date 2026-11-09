import type { z } from 'zod';
import type {
  CheckoutOrderResponseSchema,
  MyOrderSchema,
  MyOrdersPaginationSchema,
  MyOrdersFilterSchema,
  OrderItemSchema,
  OrderPricingSchema,
  OrderRestaurantSchema,
  OrderTransactionSchema,
  MyOrdersResponseSchema,
} from './schemas/orderSchemas';

export type OrderStatus =
  (typeof import('./constants/order.constants').ORDER_STATUSES)[number];

export type CheckoutOrderItem = {
  readonly menuId: number;
  readonly quantity: number;
};

export type CheckoutOrderRestaurant = {
  readonly restaurantId: number;
  readonly items: readonly CheckoutOrderItem[];
};

export type CheckoutOrderPayload = {
  readonly restaurants: readonly CheckoutOrderRestaurant[];
  readonly deliveryAddress: string;
  readonly phone: string;
  readonly paymentMethod: string;
  readonly notes: string;
};

export type OrderPricing = z.infer<typeof OrderPricingSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type OrderRestaurant = z.infer<typeof OrderRestaurantSchema>;
export type OrderTransaction = z.infer<typeof OrderTransactionSchema>;
export type CheckoutOrderResponse = z.infer<typeof CheckoutOrderResponseSchema>;
export type MyOrder = z.infer<typeof MyOrderSchema>;
export type MyOrdersPagination = z.infer<typeof MyOrdersPaginationSchema>;
export type MyOrdersFilter = z.infer<typeof MyOrdersFilterSchema>;
export type MyOrdersResponse = z.infer<typeof MyOrdersResponseSchema>;
