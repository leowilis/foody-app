import { lazy } from 'react';

// Centralized lazy-loaded code-split chunks to maximize web performance indicators
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
