import { useEffect, useState } from 'react';
import {
  AUTH_STORAGE_EVENT_NAME,
  getAuthToken,
} from '@/features/auth/authStorage';

// Tracks authentication changes made in the current tab or another tab.
export function useIsAuthenticated(): boolean {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(getAuthToken()),
  );

  useEffect(() => {
    const syncAuthentication = () => {
      setIsAuthenticated(Boolean(getAuthToken()));
    };

    window.addEventListener(AUTH_STORAGE_EVENT_NAME, syncAuthentication);
    window.addEventListener('storage', syncAuthentication);

    syncAuthentication();

    return () => {
      window.removeEventListener(AUTH_STORAGE_EVENT_NAME, syncAuthentication);
      window.removeEventListener('storage', syncAuthentication);
    };
  }, []);

  return isAuthenticated;
}
