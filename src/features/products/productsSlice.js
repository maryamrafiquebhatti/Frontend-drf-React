import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    error: '',
  },
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = '';
    },
  },
  extraReducers: (builder) => {
  },
});

export const { setProducts, setError, clearError } = productsSlice.actions;

export default productsSlice.reducer;
