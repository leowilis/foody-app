import { createBrowserRouter } from 'react-router-dom';
import AuthPage from '@/features/auth/AuthPage';
import HomePage from '@/features/home/HomePage';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import RootLayout from '@/components/layout/RootLayout';
import LazyWrapper from '@/components/layout/LazyWrapper';
import {
  DetailsPage,
  CheckoutPage,
  SuccessPage,
  MyCartPage,
} from './lazyRoutes';

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
    children: [
      {
        element: <RootLayout />,
        children: [
          { index: true, element: <HomePage /> },
          {
            path: 'details/:id',
            element: (
              <LazyWrapper>
                <DetailsPage />
              </LazyWrapper>
            ),
          },
          {
            path: 'checkout',
            element: (
              <LazyWrapper>
                <CheckoutPage />
              </LazyWrapper>
            ),
          },
          {
            path: 'success',
            element: (
              <LazyWrapper>
                <SuccessPage />
              </LazyWrapper>
            ),
          },
          {
            path: 'mycart',
            element: (
              <LazyWrapper>
                <MyCartPage />
              </LazyWrapper>
            ),
          },
        ],
      },
    ],
  },
]);
