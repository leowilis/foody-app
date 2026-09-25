import { useCartData } from './useCartData';
import { useCartHandlers } from './useCartHandlers';
import { useCartMutations } from './useCartMutations';
import { useCartSync } from './useCartSync';

/**
 * Composes cart data, mutations, interaction handlers,
 * and guest-cart synchronization into a single cart API
 * for the cart page.
 */
export function useMyCart(isLoggedIn: boolean) {
  const cartData = useCartData();
  const mutations = useCartMutations();
  const handlers = useCartHandlers({
    mutations,
  });
  const { isSyncing } = useCartSync(isLoggedIn);

  return {
    ...cartData,
    ...mutations,
    ...handlers,
    isSyncing,
  };
}
