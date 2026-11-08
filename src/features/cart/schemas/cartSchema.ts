import { z } from 'zod';

export const CartItemResponseSchema = z.object({
  id: z.number(),
  quantity: z.number(),
});

export const CartApiResponseSchema = z.object({
  success: z.literal(true),
  message: z.string().optional(),
  data: z.object({
    cartItem: CartItemResponseSchema,
  }),
});

export const CartMutationSuccessResponseSchema = z.object({
  success: z.literal(true),
  message: z.string().optional(),
});
