import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { User } from '@/types/user';
import { useIsAuthenticated } from './useIsAuthenticated';
import { AUTH_API, AUTH_QUERY_KEYS } from '../constants/auth.constants';

interface UserResponse {
  readonly success: true;
  readonly message: string;
  readonly data: User;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isUser(value: unknown): value is User {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    Number.isFinite(value.id) &&
    typeof value.name === 'string' &&
    typeof value.email === 'string' &&
    typeof value.phone === 'string' &&
    (typeof value.avatar === 'string' || value.avatar === null) &&
    (typeof value.latitude === 'number' || value.latitude === null) &&
    (typeof value.longitude === 'number' || value.longitude === null) &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string'
  );
}

function isUserResponse(value: unknown): value is UserResponse {
  return (
    isRecord(value) &&
    value.success === true &&
    typeof value.message === 'string' &&
    isUser(value.data)
  );
}

// Fetches and validates the authenticated user's profile.
export function useCurrentUser() {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.CURRENT_USER,
    queryFn: async (): Promise<User> => {
      const response = await api.get<unknown>(AUTH_API.PROFILE);

      if (!isUserResponse(response.data)) {
        throw new Error('Invalid profile response. Please try again.');
      }

      return response.data.data;
    },
    enabled: isAuthenticated,
  });
}
