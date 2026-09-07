import { Navigate, Outlet } from 'react-router-dom';

/**
 * Retrieves the authentication token from persistent browser caches.
 * Prioritizes localStorage (persistent sessions), falling back to sessionStorage (temporary sessions).
 */
const getAuthToken = (): string | null => {
  try {
    return (
      localStorage.getItem('auth_token') ?? sessionStorage.getItem('auth_token')
    );
  } catch {
    return null;
  }
};

export default function ProtectedRoute() {
  const isAuthorized = Boolean(getAuthToken());

  if (!isAuthorized) {
    return <Navigate to='/auth' replace />;
  }
  return <Outlet />;
}
