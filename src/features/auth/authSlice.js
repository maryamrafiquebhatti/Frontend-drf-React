import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    error: '',
  },
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = '';
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    registerUserSuccess: (state, action) => {
      state.user = action.payload;
      state.error = '';
    },
    registerUserFailure: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setError, clearError, setUser, registerUserSuccess, registerUserFailure } = authSlice.actions;

export default authSlice.reducer;

// Regular action creator for registration
export const registerUser = (userData) => async (dispatch) => {
  try {
    const response = await axios.post('/api/register/', userData);
    dispatch(registerUserSuccess(response.data));
  } catch (error) {
    dispatch(registerUserFailure(error.response?.data?.error || 'Registration failed'));
  }
};
