import { createBrowserRouter } from 'react-router-dom';
import LazyWrapper from '@/components/layout/LazyWrapper';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import RootLayout from '@/components/layout/RootLayout';
import AuthPage from '@/features/auth/AuthPage';
import HomePage from '@/features/home/HomePage';
import {
  CategoryPage,
  CheckoutPage,
  DetailsPage,
  FavoritesPage,
  MyCartPage,
  MyOrdersPage,
  SuccessPage,
} from './lazyRoutes';
import MyOrdersFallback from '@/features/order/components/MyOrdersFallback';

// Defines public and authenticated application routes.
export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'category',
        element: (
          <LazyWrapper>
            <CategoryPage />
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
        element: <ProtectedRoute />,
        children: [
          {
            path: 'mycart',
            element: (
              <LazyWrapper>
                <MyCartPage />
              </LazyWrapper>
            ),
          },
          {
            path: 'favorites',
            element: (
              <LazyWrapper>
                <FavoritesPage />
              </LazyWrapper>
            ),
          },
          {
            path: 'myorders',
            element: (
              <LazyWrapper fallback={<MyOrdersFallback />}>
                <MyOrdersPage />
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
