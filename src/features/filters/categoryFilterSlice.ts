import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface CategoryFilterState {
  distance: string;
  priceMin: number;
  priceMax: number;
  rating: number;
}

const initialState: CategoryFilterState = {
  distance: '',
  priceMin: 0,
  priceMax: 0,
  rating: 0,
};

const categoryFilterSlice = createSlice({
  name: 'categoryFilter',
  initialState,
  reducers: {
    setDistance: (state, action: PayloadAction<string>) => {
      state.distance = action.payload;
    },
    setPriceMin: (state, action: PayloadAction<number>) => {
      state.priceMin = action.payload;
    },
    setPriceMax: (state, action: PayloadAction<number>) => {
      state.priceMax = action.payload;
    },
    setRating: (state, action: PayloadAction<number>) => {
      state.rating = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setDistance,
  setPriceMin,
  setPriceMax,
  setRating,
  resetFilters,
} = categoryFilterSlice.actions;

export default categoryFilterSlice.reducer;
