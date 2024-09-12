import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productsReducer from '../features/products/productsSlice';
import adminDashboardReducer from '../features/adminDashboard/adminDashboardSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    adminDashboard: adminDashboardReducer,
  },
});

export default store;
