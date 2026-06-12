import { createBrowserRouter } from 'react-router-dom';
import AuthPage from '@/features/auth/AuthPage';
import HomePage from '@/features/home/HomePage';
import ProtectedRoute from '@/components/layout/ProctectedRoute';

/**
 * Global application router configuration.
 * Defines public auth routes and protected app routes.
 */
export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [{ index: true, element: <HomePage /> }],
  },
]);
