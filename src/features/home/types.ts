export type RecommendedItem = {
  readonly id: number;
  readonly name: string;
  readonly star: number;
  readonly place: string;
  readonly logo: string;
  readonly images: readonly string[];
  readonly category: string;
  readonly reviewCount: number;
  readonly distance?: number;
};

export type RecommendedResponse = {
  readonly success: boolean;
  readonly message: string;
  readonly data?: {
    readonly recommendations?: readonly RecommendedItem[];
    readonly restaurants?: readonly RecommendedItem[];
    readonly pagination?: {
      readonly page?: number;
      readonly limit?: number;
      readonly total?: number;
      readonly totalPages?: number;
    };
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
