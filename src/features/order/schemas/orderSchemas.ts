import { z } from 'zod';
import { ORDER_STATUSES } from '../constants/order.constants';

// Validates a monetary amount returned by the API.
const amountSchema = z.number().finite().nonnegative();

// Validates an integer identifier.
const idSchema = z.number().int().nonnegative();

// Validates an ISO date string returned by the API.
const dateSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Invalid date');

// Validates order pricing details.
export const OrderPricingSchema = z.object({
  subtotal: amountSchema,
  serviceFee: amountSchema,
  deliveryFee: amountSchema,
  totalPrice: amountSchema,
});

// Validates a restaurant included in an order.
export const OrderRestaurantInfoSchema = z.object({
  id: idSchema,
  name: z.string(),
  logo: z.string(),
});

// Validates an item included in an order.
export const OrderItemSchema = z.object({
  menuId: idSchema,
  menuName: z.string(),
  price: amountSchema,
  image: z.string().optional(),
  quantity: z.number().int().positive(),
  itemTotal: amountSchema,
});

// Validates restaurant details and items in an order.
export const OrderRestaurantSchema = z.object({
  restaurant: OrderRestaurantInfoSchema,
  items: z.array(OrderItemSchema),
  subtotal: amountSchema,
});

// Validates a transaction returned by the API.
export const OrderTransactionSchema = z.object({
  id: idSchema,
  transactionId: z.string().min(1),
  status: z.enum(ORDER_STATUSES),
  paymentMethod: z.string(),
  deliveryAddress: z.string(),
  phone: z.string(),
  pricing: OrderPricingSchema,
  restaurants: z.array(OrderRestaurantSchema),
  createdAt: dateSchema,
});

// Validates the checkout API response.
export const CheckoutOrderResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    transaction: OrderTransactionSchema,
  }),
});

// Validates an order in the order history response.
export const MyOrderSchema = OrderTransactionSchema.extend({
  updatedAt: dateSchema,
});

// Validates pagination metadata.
export const MyOrdersPaginationSchema = z.object({
  page: z.number().int().nonnegative(),
  limit: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

// Validates the applied order history filter.
export const MyOrdersFilterSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

// Validates the order history API response.
export const MyOrdersResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    orders: z.array(MyOrderSchema),
    pagination: MyOrdersPaginationSchema,
    filter: MyOrdersFilterSchema,
  }),
});
