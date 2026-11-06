import { lazy } from 'react';

// Defines lazy-loaded route components for route-level code splitting.
export const CategoryPage = lazy(
  () => import('@/features/discovery/CategoryPage'),
);

export const DetailsPage = lazy(
  () => import('@/features/restaurant/DetailsPage'),
);

export const CheckoutPage = lazy(
  () => import('@/features/checkout/CheckoutPage'),
);

export const SuccessPage = lazy(
  () => import('@/features/checkout/SuccessPage'),
);

export const FavoritesPage = lazy(
  () => import('@/features/favorites/FavoritesPage'),
);

export const MyCartPage = lazy(() => import('@/features/cart/MyCartPage'));
export const MyOrdersPage = lazy(() => import('@/features/order/MyOrderPage'));
