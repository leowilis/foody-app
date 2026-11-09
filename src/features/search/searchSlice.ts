import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { SEARCH_CONFIG } from './search.constants';

interface SearchState {
  keyword: string;
}

const initialState: SearchState = {
  keyword: '',
};

// Stores the global search keyword used across discovery pages.
const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setKeyword: (state, action: PayloadAction<string>) => {
      state.keyword = action.payload.slice(0, SEARCH_CONFIG.maxQueryLength);
    },
    clearKeyword: (state) => {
      state.keyword = '';
    },
  },
});

export const { setKeyword, clearKeyword } = searchSlice.actions;

export default searchSlice.reducer;
