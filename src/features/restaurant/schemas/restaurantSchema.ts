import { z } from 'zod';

export const MenuItemSchema = z.object({
  id: z.number(),
  foodName: z.string(),
  price: z.number(),
  type: z.enum(['food', 'drink']),
  image: z.string().default(''),
});

export const ReviewUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  avatar: z.string().nullable(),
});

export const ReviewItemSchema = z.object({
  id: z.number(),
  star: z.string(),
  comment: z.string(),
  createdAt: z.string(),
  user: ReviewUserSchema,
});

export const RestaurantDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  star: z.number(),
  averageRating: z.number(),
  place: z.string(),
  coordinates: z.object({ lat: z.number(), long: z.number() }).optional(),
  logo: z.string(),
  images: z.array(z.string()),
  category: z.string(),
  totalMenus: z.number(),
  totalReviews: z.number(),
  menus: z.array(MenuItemSchema),
  reviews: z.array(ReviewItemSchema),
});

export const DetailResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: RestaurantDetailSchema.optional(),
});

export type MenuItem = z.infer<typeof MenuItemSchema>;
export type ReviewUser = z.infer<typeof ReviewUserSchema>;
export type ReviewItem = z.infer<typeof ReviewItemSchema>;
export type RestaurantDetail = z.infer<typeof RestaurantDetailSchema>;
export type DetailResponse = z.infer<typeof DetailResponseSchema>;
export type MenuFilter = 'all' | 'food' | 'drink';
