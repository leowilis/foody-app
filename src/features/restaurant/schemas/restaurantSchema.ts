import { z } from 'zod';

export const MenuSchema = z.object({
  id: z.number(),
  foodName: z.string(),
  price: z.number(),
  image: z.string().optional().or(z.literal('')), 
});

export const RestaurantDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  star: z.number(),
  logo: z.string(),
  images: z.array(z.string()),
  place: z.string(),
  menus: z.array(MenuSchema),
});

export const DetailResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: RestaurantDetailSchema.optional(), // Safe alignment for empty query responses
});
