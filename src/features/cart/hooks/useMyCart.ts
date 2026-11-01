import { useCartData } from './useCartData';
import { useCartHandlers } from './useCartHandlers';
import { useCartMutations } from './useCartMutations';

/**
 * Composes cart data, mutations, and handlers
 * into the API used by cart consumers.
 */
export function useMyCart() {
  const cartData = useCartData();
  const mutations = useCartMutations();
  const handlers = useCartHandlers({
    mutations,
  });

  return {
    ...cartData,
    ...mutations,
    ...handlers,
  };
}
