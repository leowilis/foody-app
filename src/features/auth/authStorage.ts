import type { AuthUser } from '@/types/user';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';
const AUTH_STORAGE_EVENT = 'foody:auth-change';

type StorageType = 'local' | 'session';

// Returns browser storage when it is available.
function getStorage(type: StorageType): Storage | null {
  try {
    return type === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

// Reads a value without allowing storage errors to break the application.
function readStorageValue(storage: Storage | null, key: string): string | null {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

// Removes a value without allowing storage errors to break the application.
function removeStorageValue(storage: Storage | null, key: string): void {
  try {
    storage?.removeItem(key);
  } catch {
    // Storage may be unavailable or read-only.
  }
}

// Reads the current authentication token from browser storage.
export function getAuthToken(): string | null {
  return (
    readStorageValue(getStorage('local'), AUTH_TOKEN_KEY) ??
    readStorageValue(getStorage('session'), AUTH_TOKEN_KEY)
  );
}

// Reads the cached authenticated user's display information.
export function getAuthUser(): Pick<AuthUser, 'name' | 'avatar'> | null {
  const raw =
    readStorageValue(getStorage('local'), AUTH_USER_KEY) ??
    readStorageValue(getStorage('session'), AUTH_USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    const user: unknown = JSON.parse(raw);

    if (
      typeof user !== 'object' ||
      user === null ||
      !('name' in user) ||
      typeof user.name !== 'string' ||
      !('avatar' in user) ||
      (typeof user.avatar !== 'string' && user.avatar !== null)
    ) {
      return null;
    }

    return {
      name: user.name,
      avatar: user.avatar,
    };
  } catch {
    return null;
  }
}

// Stores the authenticated session and notifies same-tab consumers.
export function setAuthSession(
  token: string,
  user: AuthUser,
  remember: boolean,
): void {
  const storage = getStorage(remember ? 'local' : 'session');
  const otherStorage = getStorage(remember ? 'session' : 'local');

  if (!storage) {
    throw new Error('Browser storage is unavailable.');
  }

  storage.setItem(AUTH_TOKEN_KEY, token);
  storage.setItem(AUTH_USER_KEY, JSON.stringify(user));

  removeStorageValue(otherStorage, AUTH_TOKEN_KEY);
  removeStorageValue(otherStorage, AUTH_USER_KEY);

  notifyAuthChange();
}

// Clears authentication data from both browser storage locations.
export function clearAuthSession(): void {
  for (const type of ['local', 'session'] as const) {
    const storage = getStorage(type);

    removeStorageValue(storage, AUTH_TOKEN_KEY);
    removeStorageValue(storage, AUTH_USER_KEY);
  }

  notifyAuthChange();
}

// Notifies same-tab consumers that authentication storage changed.
export function notifyAuthChange(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_STORAGE_EVENT));
  }
}

export const AUTH_STORAGE_EVENT_NAME = AUTH_STORAGE_EVENT;
