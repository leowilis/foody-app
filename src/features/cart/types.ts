export type CartMenuType = 'food' | 'drink';

export type CartMenu = {
  readonly id: number;
  readonly foodName: string;
  readonly price: number;
  readonly type: CartMenuType;
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
  readonly message?: string;
  readonly data?: {
    readonly cart?: CartRestaurant[];
    readonly summary?: {
      readonly totalItems: number;
      readonly totalPrice: number;
      readonly restaurantCount: number;
    };
  };
};

export type CartItem = {
  readonly menuId: number;
  readonly restaurantId: number;
  readonly restaurantName: string;
  readonly name: string;
  readonly price: number;
  readonly type: CartMenuType;
  readonly image: string;
  readonly qty: number;
  readonly cartItemId?: number;
};

export type AddCartPayload = {
  readonly restaurantId: number;
  readonly restaurantName: string;
  readonly menuId: number;
  readonly quantity: number;
  readonly name: string;
  readonly price: number;
  readonly type: CartMenuType;
  readonly image: string;
};

export type UpdateCartPayload = {
  readonly cartItemId: number;
  readonly menuId: number;
  readonly quantity: number;
};

export type DeleteCartPayload = {
  readonly cartItemId: number;
  readonly menuId: number;
};

export type CartApiResponse = {
  readonly success: boolean;
  readonly data?: {
    readonly cartItem?: {
      readonly id: number;
      readonly quantity: number;
    };
  };
};

export type UpdateCartResponse = CartApiResponse;

export type DeleteCartResponse = {
  readonly success: boolean;
};

export type ClearCartResponse = {
  readonly success: boolean;
  readonly message?: string;
};

export type CartMutationVariables =
  | AddCartPayload
  | UpdateCartPayload
  | DeleteCartPayload;
