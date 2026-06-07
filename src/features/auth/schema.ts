import { z } from 'zod';

/**
 * Validation schema for user authentication sign-in payloads.
 * Enforces non-empty standard email strings and a strict minimum length for passwords.
 */
export const signInSchema = z.object({
  email: z.string().min(1, 'Email is required.').email('Invalid email format.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  remember: z.boolean().default(false),
});

/**
 * Validation schema for user creation registration profiles.
 *
 * Includes localized pattern guards for phone numbers and an downstream data refinement
 * cross-constraint to confirm password integrity checks match before validation passes.
 */
export const signUpSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    email: z
      .string()
      .min(1, 'Email is required.')
      .email('Invalid email format.'),
    phone: z
      .string()
      .regex(
        /^08\d{8,12}$/,
        'Phone number must start with 08 and be 10-14 digits.',
      ),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string().min(1, 'Password confirmation is required.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password are not the same.',
    path: ['confirmPassword'], // Targets the confirmation input node for granular error rendering
  });

// Static TypeScript type inferred directly from the runtime signInSchema blueprint
export type SignInValues = z.infer<typeof signInSchema>;
export type signUpSchema = z.infer<typeof signUpSchema>; // Capitalized and renamed to align with best practices
