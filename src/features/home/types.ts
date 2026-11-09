export type RecommendedItem = {
  readonly id: number;
  readonly name: string;
  readonly star: number;
  readonly place: string;
  readonly logo: string;
  readonly images: readonly string[];
  readonly category?: string;
  readonly reviewCount: number;
  readonly distance?: number;
};

export type Pagination = {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
};

export type RecommendedResponse = {
  readonly success: boolean;
  readonly message?: string;
  readonly data?: {
    readonly recommendations?: readonly RecommendedItem[];
    readonly restaurants?: readonly RecommendedItem[];
    readonly pagination?: Pagination;
  };
};

export type SearchResponse = {
  readonly success: true;
  readonly data: {
    readonly restaurants: readonly RecommendedItem[];
    readonly pagination: Pagination;
    readonly searchQuery: string;
  };
};

export type NearbyResponse = {
  readonly success: boolean;
  readonly data?: {
    readonly restaurants?: readonly RecommendedItem[];
  };
};

export type ActiveList =
  | 'recommended'
  | 'best-seller'
  | 'all-restaurants'
  | 'nearby'
  | 'search';
