import axios from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with support for conditional values
 * and conflict resolution.
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/**
 * Extracts a user-friendly error message from an unknown error.
 *
 * Handles Axios responses by prioritizing validation errors and
 * backend messages before falling back to a generic error message.
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: string[] }
      | undefined;

    if (data?.errors?.length) return data.errors.join(', ');
    if (data?.message) return data.message;
  }

  return 'An error occurred. Please try again.';
};
