import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthPage from '../features/auth/AuthPage';

/**
 * Global application router initialization.
 * Configures the primary navigation paths and anchors high-level entry components
 */
export const router = createBrowserRouter([
   {
    path: '/',
    element: <Navigate to="/auth" replace />,
  },
  {
    // Endpoint mapping for user authentication flows (Login / Registration)
    path: '/auth',
    element: <AuthPage />,
  },
]);
