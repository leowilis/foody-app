import axios from 'axios';

// Extracts a human-readable message from an Axios error.
export const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (err.code === 'ECONNABORTED')
      return 'Request timeout. Please try again.';
    if (!err.response) return 'Unable to connect to server.';
  }
  return 'Failed to load data.';
};

// Checks whether the error represents an unauthorized (401) response.
export const isUnauthorizedError = (err: unknown): boolean => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const data = err.response?.data as { message?: string } | undefined;
    return status === 401 || data?.message === 'Access token required';
  }
  return false;
};
