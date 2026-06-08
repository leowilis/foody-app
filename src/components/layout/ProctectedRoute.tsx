import { Navigate, Outlet } from 'react-router-dom';

/**
 * 
 * Pure helper utility to retrieve the authentication token from persistent browser caches.
 * Checks localStorage first for "Remember Me" users, falling back to sessionStorage.
 */
const getToken = () =>
  localStorage.getItem('auth_token') ?? sessionStorage.getItem('auth_token');

export default function ProtectedRoute() {
  if (!getToken()) return <Navigate to='/auth' replace />;
  return <Outlet />;
}
