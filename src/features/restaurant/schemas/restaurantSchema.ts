import { z } from 'zod';

const numericValueSchema = z
  .union([z.number(), z.string().trim().min(1).transform(Number)])
  .pipe(z.number().finite());

// Validates a restaurant menu item returned by the API.
export const MenuItemSchema = z.object({
  id: z.number(),
  foodName: z.string(),
  price: z.number(),
  type: z.enum(['food', 'drink']).optional().default('food'),
  image: z.string().default(''),
});

// Validates the user information attached to a restaurant review.
export const ReviewUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  avatar: z.string().nullable(),
});

// Validates an individual restaurant review.
export const ReviewItemSchema = z.object({
  id: z.number(),
  star: numericValueSchema,
  comment: z.string(),
  createdAt: z.string(),
  user: ReviewUserSchema,
});

// Validates restaurant detail data returned by the API.
export const RestaurantDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  star: numericValueSchema,
  averageRating: numericValueSchema.optional().default(0),
  place: z.string().optional().default(''),
  logo: z.string().optional().default(''),
  images: z.array(z.string()).optional().default([]),
  category: z.string().optional().default(''),
  totalMenus: z.number().optional().default(0),
  totalReviews: z.number().optional().default(0),
  menus: z.array(MenuItemSchema).optional().default([]),
  reviews: z.array(ReviewItemSchema).optional().default([]),
});

// Validates the API response returned by the restaurant detail endpoint.
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
