import axios from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with support for conditional logic and conflict resolution.
 *
 * Leverages `clsx` to parse conditional object maps and arrays, then processes the output
 * through `tailwind-merge` to resolve any colliding class overrides in the DOM.
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/**
 * Parses an unknown error object and extracts a human-readable error message.
 *
 * Specifically sniffs for native Axios exceptions, safely traversing nested backend responses
 * to surface validation errors (`data.errors`) or generic failure alerts (`data.message`).
 * Automatically falls back to a standardized generic string if the error structure is unhandled.
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
