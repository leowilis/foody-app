import type { UseMutationResult } from '@tanstack/react-query';

export type CartMenu = {
  readonly id: number;
  readonly foodName: string;
  readonly price: number;
  readonly type: 'food' | 'drink';
  readonly image: string;
};

export type CartGroupItem = {
  readonly id: number;
  readonly menu: CartMenu;
  readonly quantity: number;
  readonly itemTotal: number;
};

export type CartRestaurant = {
  readonly restaurant: {
    readonly id: number;
    readonly name: string;
    readonly logo: string;
  };
  readonly items: CartGroupItem[];
  readonly subtotal: number;
};

export type CartResponse = {
  readonly success: boolean;
  readonly message: string;
  readonly data?: {
    readonly cart?: CartRestaurant[];
    readonly summary?: {
      readonly totalItems: number;
      readonly totalPrice: number;
      readonly restaurantCount: number;
    };
  };
};

export type CartItemPayload = {
  readonly itemId: number;
  readonly menuId: number;
  readonly restaurantId: number;
  readonly restaurantName: string;
  readonly name: string;
  readonly price: number;
  readonly image: string;
  readonly currentQty: number;
};

export type CartItem = {
  readonly menuId: number;
  readonly restaurantId: number;
  readonly restaurantName: string;
  readonly name: string;
  readonly price: number;
  readonly image: string;
  qty: number;
  cartItemId?: number;
};

export type CartApiResponse = {
  readonly success: boolean
  readonly data?: {
    readonly cartItem?: {
      readonly id: number
      readonly quantity: number
    }
  }
}

type UpdatePayload = { readonly cartItemId: number; readonly quantity: number };
type DeletePayload = { readonly cartItemId: number; readonly menuId: number };
type UpdateResponse = {
  readonly data?: {
    readonly cartItem?: { readonly id: number; readonly quantity: number };
  };
};

export type CartMutations = {
  readonly updateMutation: UseMutationResult<
    UpdateResponse,
    Error,
    UpdatePayload
  >;
  readonly deleteMutation: UseMutationResult<
    { success: boolean },
    Error,
    DeletePayload
  >;
  readonly handleIncrease: (item: CartGroupItem, group: CartRestaurant) => void;
  readonly handleDecrease: (item: CartGroupItem, group: CartRestaurant) => void;
};

export type UpdateCartResponse = {
  readonly success: boolean;
  readonly data?: {
    readonly cartItem?: { readonly id: number; readonly quantity: number };
  };
};

export type DeleteCartResponse = {
  readonly success: boolean;
};
