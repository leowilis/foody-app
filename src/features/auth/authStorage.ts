import type { User } from '@/types/user';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';
const AUTH_STORAGE_EVENT = 'foody:auth-change';

type AuthStorage = Storage;

const getStorages = (): AuthStorage[] => [localStorage, sessionStorage];

// Reads the current authentication token from browser storage.
export function getAuthToken(): string | null {
  return (
    localStorage.getItem(AUTH_TOKEN_KEY) ??
    sessionStorage.getItem(AUTH_TOKEN_KEY)
  );
}

// Reads the cached authenticated user from browser storage.
export function getAuthUser(): Pick<User, 'name' | 'avatar'> | null {
  const raw =
    localStorage.getItem(AUTH_USER_KEY) ??
    sessionStorage.getItem(AUTH_USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as Pick<User, 'name' | 'avatar'>;
  } catch {
    return null;
  }
}

// Stores the authenticated session and notifies same-tab consumers.
export function setAuthSession(
  token: string,
  user: Pick<User, 'name' | 'avatar'>,
  remember: boolean,
): void {
  const storage = remember ? localStorage : sessionStorage;
  const other = remember ? sessionStorage : localStorage;

  storage.setItem(AUTH_TOKEN_KEY, token);
  storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  other.removeItem(AUTH_TOKEN_KEY);
  other.removeItem(AUTH_USER_KEY);

  notifyAuthChange();
}

// Clears authentication data from both browser storage locations.
export function clearAuthSession(): void {
  for (const storage of getStorages()) {
    storage.removeItem(AUTH_TOKEN_KEY);
    storage.removeItem(AUTH_USER_KEY);
  }

  notifyAuthChange();
}

// Notifies same-tab consumers that authentication storage changed.
export function notifyAuthChange(): void {
  window.dispatchEvent(new Event(AUTH_STORAGE_EVENT));
}

export const AUTH_STORAGE_EVENT_NAME = AUTH_STORAGE_EVENT;
