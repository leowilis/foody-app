import type { CartGroupItem, CartRestaurant } from '@/features/cart/types';

export type CheckoutCartItem = CartGroupItem;
export type CheckoutCartGroup = CartRestaurant;

export type BankOption = {
  readonly value: string;
  readonly label: string;
  readonly logo: string;
};
