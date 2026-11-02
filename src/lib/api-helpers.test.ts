import axios, { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';
import { getErrorMessage, isUnauthorizedError } from './api-helpers';

describe('getErrorMessage', () => {
  it('returns backend validation errors', () => {
    const error = new AxiosError('Request failed', 'ERR_BAD_REQUEST');
    error.response = {
      data: { errors: ['Email is required', 'Invalid email'] },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: { headers: new axios.AxiosHeaders() },
    };

    expect(getErrorMessage(error)).toBe('Email is required, Invalid email');
  });

  it('returns a regular Error message', () => {
    expect(getErrorMessage(new Error('Invalid authentication response.'))).toBe(
      'Invalid authentication response.',
    );
  });

  it('returns the timeout message for Axios timeout errors', () => {
    const error = new AxiosError('timeout', 'ECONNABORTED');

    expect(getErrorMessage(error)).toBe('Request timeout. Please try again.');
  });
});

describe('isUnauthorizedError', () => {
  it('returns true for HTTP 401 errors', () => {
    const error = new AxiosError('Unauthorized');
    error.response = {
      data: {},
      status: 401,
      statusText: 'Unauthorized',
      headers: {},
      config: { headers: new axios.AxiosHeaders() },
    };

    expect(isUnauthorizedError(error)).toBe(true);
  });

  it('returns false for regular errors', () => {
    expect(isUnauthorizedError(new Error('Something went wrong'))).toBe(false);
  });
});
