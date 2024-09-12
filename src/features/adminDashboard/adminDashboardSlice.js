import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState: {
    products: [],
    newProduct: { name: '', description: '', price: '' },
    editProduct: { name: '', description: '', price: '' },
    error: '',
    isEditing: null,
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = '';
    },
    setNewProduct: (state, action) => {
      state.newProduct = action.payload;
    },
    setEditProduct: (state, action) => {
      state.editProduct = action.payload;
    },
    setIsEditing: (state, action) => {
      state.isEditing = action.payload;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(product => product.id === action.payload.id);
      if (index >= 0) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(product => product.id !== action.payload);
    },
  },
});

export const {
  setProducts,
  setError,
  clearError,
  setNewProduct,
  setEditProduct,
  setIsEditing,
  addProduct,
  updateProduct,
  deleteProduct,
} = adminDashboardSlice.actions;

export default adminDashboardSlice.reducer;
