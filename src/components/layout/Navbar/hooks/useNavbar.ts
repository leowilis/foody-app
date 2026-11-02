import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '@/app/store';
import { clearCart } from '@/features/cart/cartSlice';
import type { CartResponse } from '@/features/cart/types';
import {
  AUTH_STORAGE_EVENT_NAME,
  clearAuthSession,
  getAuthToken,
  getAuthUser,
} from '@/features/auth/authStorage';
import { api } from '@/lib/api';
import {
  CART_API,
  CART_QUERY_KEY,
} from '@/features/cart/constants/cart.constants';
import { CHECKOUT_SUCCESS_STORAGE_KEY } from '@/config/storage.constants';

// Manages navbar authentication state, cart count, and logout.
export function useNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isLogin, setIsLogin] = useState(false);
  const [profileName, setProfileName] = useState('User');
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const reduxCartCount = cartItems.reduce((total, item) => total + item.qty, 0);

  const { data: cartData } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: async (): Promise<CartResponse> => {
      const response = await api.get<CartResponse>(CART_API.BASE);

      return response.data;
    },
    enabled: isLogin,
  });

  const serverCartCount = cartData?.data?.summary?.totalItems;
  const cartCount = isLogin ? (serverCartCount ?? reduxCartCount) : 0;

  useEffect(() => {
    const syncAuth = () => {
      const token = getAuthToken();
      const user = getAuthUser();

      setIsLogin(Boolean(token));

      if (!user) {
        setProfileName('User');
        setProfileAvatar(null);
        return;
      }

      setProfileName(user.name ?? 'User');
      setProfileAvatar(user.avatar ?? null);
    };

    syncAuth();

    window.addEventListener('storage', syncAuth);
    window.addEventListener(AUTH_STORAGE_EVENT_NAME, syncAuth);

    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener(AUTH_STORAGE_EVENT_NAME, syncAuth);
    };
  }, []);

  const handleCartClick = () => {
    navigate('/mycart');
  };

  const handleLogout = () => {
    queryClient.clear();
    clearAuthSession();
    dispatch(clearCart());

    try {
      sessionStorage.removeItem(CHECKOUT_SUCCESS_STORAGE_KEY);
    } catch {
      // Session storage may be unavailable.
    }

    setIsLogin(false);

    navigate('/auth', {
      state: {
        tab: 'signin',
      },
    });
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'US';

  return {
    isLogin,
    profileName,
    profileAvatar,
    cartCount,
    handleCartClick,
    handleLogout,
    getInitials,
    navigate,
  };
}
