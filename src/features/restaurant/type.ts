export type MenuItem = {
  id: number;
  foodName: string;
  price: number;
  type: 'food' | 'drink';
  image: string;
};

export type ReviewItem = {
  id: number;
  star: string;
  comment: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
};

export type RestaurantDetail = {
  id: number;
  name: string;
  star: number;
  averageRating: number;
  place: string;
  coordinates?: { lat: number; long: number };
  logo: string;
  images: string[];
  category: string;
  totalMenus: number;
  totalReviews: number;
  menus: MenuItem[];
  reviews: ReviewItem[];
};

export type DetailResponse = {
  success: boolean;
  message: string;
  data?: RestaurantDetail;
};

export type MenuFilter = 'all' | 'food' | 'drink';
