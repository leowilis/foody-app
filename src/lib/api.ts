import axios, { type InternalAxiosRequestConfig } from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

/**
 * Strips trailing Swagger path from the base URL if present.
 * Ensures all requests hit the correct API root.
 */
const sanitizedBaseUrl = rawBaseUrl
  ? rawBaseUrl.replace(/\/api-swagger\/?$/i, '')
  : '';

export const API_BASE_URL = sanitizedBaseUrl;

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

// Request interceptor — injects Bearer token from storage if available.
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      localStorage.getItem('auth_token') ??
      sessionStorage.getItem('auth_token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — clears auth storage and redirects on 401 Unauthorized.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_user');
      window.location.href = '/auth';
    }

    return Promise.reject(error);
  },
);
