export const AUTH_API = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  PROFILE: '/api/auth/profile',
} as const;

export const AUTH_QUERY_KEYS = {
  CURRENT_USER: ['auth', 'current-user'] as const,
} as const;
