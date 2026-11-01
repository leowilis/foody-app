import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { useAddCartMutation } from './useAddCartMutation';
import { useDeleteCartMutation } from './useDeleteCartMutation';
import { useUpdateCartMutation } from './useUpdateCartMutation';

// Composes cart mutations into the API used by cart consumers.
export function useCartMutations() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const addMutation = useAddCartMutation();
  const updateMutation = useUpdateCartMutation();
  const deleteMutation = useDeleteCartMutation();

  return {
    cartItems,
    addMutation,
    updateMutation,
    deleteMutation,
  };
}

export type CartMutations = ReturnType<typeof useCartMutations>;
