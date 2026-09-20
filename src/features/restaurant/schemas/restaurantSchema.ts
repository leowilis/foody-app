import { z } from 'zod';

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
  star: z.string(),
  comment: z.string(),
  createdAt: z.string(),
  user: ReviewUserSchema,
});

/**
 * Validates the complete restaurant detail response data.
 *
 * Normalizes numeric rating values that may be returned by the API
 * as either numbers or numeric strings.
 */
export const RestaurantDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  star: z.union([z.number(), z.string()]).transform(Number),
  averageRating: z
    .union([z.number(), z.string()])
    .transform(Number)
    .optional()
    .default(0),
  place: z.string().optional().default(''),
  coordinates: z
    .object({
      lat: z.number(),
      long: z.number(),
    })
    .optional(),
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

// Represents a validated restaurant menu item.
export type MenuItem = z.infer<typeof MenuItemSchema>;

//  Represents the user information associated with a review.
export type ReviewUser = z.infer<typeof ReviewUserSchema>;

// Represents a validated restaurant review.
export type ReviewItem = z.infer<typeof ReviewItemSchema>;

// Represents the validated restaurant detail data.
export type RestaurantDetail = z.infer<typeof RestaurantDetailSchema>;

// Represents the validated restaurant detail API response.
export type DetailResponse = z.infer<typeof DetailResponseSchema>;

// Available filters for restaurant menu items.
export type MenuFilter = 'all' | 'food' | 'drink';
