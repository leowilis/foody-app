import { Navigate, Outlet } from 'react-router-dom';
import { useIsAuthenticated } from '@/features/auth/hooks/useIsAuthenticated';

// Protects authenticated routes by requiring an active auth token.
export default function ProtectedRoute() {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to='/auth' replace />;
  }

  return <Outlet />;
}
