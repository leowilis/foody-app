import { clearAuthSession, getAuthToken } from '@/features/auth/authStorage';
import { AUTH_API } from '@/features/auth/constants/auth.constants';
import axios, { type InternalAxiosRequestConfig } from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

// Strips the trailing Swagger path from the base URL if present.
const sanitizedBaseUrl = rawBaseUrl
  ? rawBaseUrl.replace(/\/api-swagger\/?$/i, '')
  : '';

export const API_BASE_URL = sanitizedBaseUrl;

/**
 * Prevents multiple simultaneous 401 responses from triggering
 * repeated session cleanup and redirects.
 */
let isHandlingUnauthorized = false;

// Returns the normalized pathname of an API request URL.
function getRequestPath(url?: string): string | null {
  if (!url) {
    return null;
  }

  try {
    return new URL(url, API_BASE_URL || 'http://localhost').pathname.replace(
      /\/+$/,
      '',
    );
  } catch {
    return null;
  }
}

// Checks whether a request targets a public authentication endpoint.
function isAuthEndpoint(url?: string): boolean {
  const path = getRequestPath(url);

  return path === AUTH_API.LOGIN || path === AUTH_API.REGISTER;
}

/**
 * Axios instance with base URL and default headers.
 * All API requests should use this instance.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Injects the Bearer token into requests that require authentication.
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (isAuthEndpoint(config.url)) {
      return config;
    }

    const token = getAuthToken();

    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Clears the session when an authenticated request returns 401.
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response?.status === 401;
    const isPublicAuthRequest = isAuthEndpoint(error.config?.url);
    const requestHadAuthToken = Boolean(
      error.config?.headers?.get('Authorization'),
    );

    if (
      isUnauthorized &&
      !isPublicAuthRequest &&
      requestHadAuthToken &&
      !isHandlingUnauthorized
    ) {
      isHandlingUnauthorized = true;

      clearAuthSession();
      window.location.assign('/auth');
    }

    return Promise.reject(error);
  },
);
