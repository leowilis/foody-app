import axios from 'axios';

// Extracts a human-readable message from an unknown error.
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: string[] }
      | undefined;

    if (data?.errors?.length) {
      return data.errors.join(', ');
    }

    if (data?.message) {
      return data.message;
    }

    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }

    if (!error.response) {
      return 'Unable to connect to server.';
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return 'Failed to load data.';
};

// Checks whether the error represents an unauthorized (401) response.
export const isUnauthorizedError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;
  const data = error.response?.data as { message?: string } | undefined;

  return status === 401 || data?.message === 'Access token required';
};
