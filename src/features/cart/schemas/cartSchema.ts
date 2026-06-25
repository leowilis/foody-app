import { z } from 'zod';

export const CartItemResponseSchema = z.object({
  id: z.number(),
  quantity: z.number(),
});

export const CartApiResponseSchema = z.object({
  data: z
    .object({
      cartItem: CartItemResponseSchema,
    })
    .optional(),
});
