import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from 'axios';
import { api } from '@/lib/api';
import type { RootState } from '@/app/store';
import { clearCart } from '@/features/cart/cartSlice';
import { clearFilters } from '@/features/filters/categoryFilterSlice';


type AuthUser = {
  name?: string;
  avatar?: string | null;
};

// Manages navbar scroll state, auth state, cart count, and logout.
export function useNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient(); 
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [profileName, setProfileName] = useState('User');
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const reduxCartCount = cartItems.reduce((total, item) => total + item.qty, 0);

  const { data: cartData, error: cartErr } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await api.get('/api/cart');
      return res.data as { data?: { summary?: { totalItems: number } } };
    },
    enabled: isLogin,
  });

  const serverCartCount =
    axios.isAxiosError(cartErr) && cartErr.response?.status === 401
      ? 0
      : (cartData?.data?.summary?.totalItems ?? 0);

  const cartCount = Math.max(reduxCartCount, serverCartCount);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const syncAuth = () => {
      const token =
        localStorage.getItem('auth_token') ??
        sessionStorage.getItem('auth_token');
      setIsLogin(Boolean(token));

      const raw =
        localStorage.getItem('auth_user') ??
        sessionStorage.getItem('auth_user');
      if (!raw) {
        setProfileName('User');
        setProfileAvatar(null);
        return;
      }
      try {
        const parsed = JSON.parse(raw) as AuthUser;
        setProfileName(parsed.name ?? 'User');
        setProfileAvatar(parsed.avatar ?? null);
      } catch {
        setProfileName('User');
        setProfileAvatar(null);
      }
    };

    syncAuth();
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  const handleCartClick = () => {
    if (cartCount > 0) {
      navigate('/mycart');
    } else {
      toast('Your cart is still empty.', {
        description: "Let's add a favorite menu first!",
      });
    }
  };

  const handleLogout = () => {
    queryClient.clear(); 
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('cart_state');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');
    dispatch(clearCart());
    dispatch(clearFilters());
    setIsLogin(false);
    navigate('/auth', { state: { tab: 'signin' } });
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || 'US';

  return {
    isScrolled,
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
