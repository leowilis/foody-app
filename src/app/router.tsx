import { createBrowserRouter } from 'react-router-dom';
import AuthPage from '@/features/auth/AuthPage';
import HomePage from '@/features/home/HomePage';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import RootLayout from '@/components/layout/RootLayout';
import LazyWrapper from '@/components/layout/LazyWrapper';

// Clean centralized lazy route imports!
import {
  DetailsPage,
  CheckoutPage,
  SuccessPage,
  MyCartPage,
} from './lazyRoutes';

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
            path: 'mycart',
            element: (
              <LazyWrapper>
                <MyCartPage />
              </LazyWrapper>
            ),
          },
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
        ],
      },
    ],
  },
]);
