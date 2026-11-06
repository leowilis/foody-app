export type RestaurantDiscoveryItem = {
  readonly id: number;
  readonly name: string;
  readonly star: number;
  readonly place: string;
  readonly logo: string;
  readonly images: readonly string[];
  readonly category: string;
  readonly reviewCount: number;
  readonly menuCount: number;
  readonly priceRange: {
    readonly min: number;
    readonly max: number;
  };
  readonly distance: number;
};

export type RestaurantDiscoveryFilters = {
  readonly location?: string;
  readonly range?: number;
  readonly priceMin?: number;
  readonly priceMax?: number;
  readonly rating?: number;
  readonly category?: string;
};

export type RestaurantDiscoveryPagination = {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
};

export type RestaurantDiscoveryResponse = {
  readonly success: boolean;
  readonly data: {
    readonly restaurants: readonly RestaurantDiscoveryItem[];
    readonly pagination: RestaurantDiscoveryPagination;
  };
};
