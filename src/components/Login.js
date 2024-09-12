
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser, setError, clearError } from '../features/auth/authSlice';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.auth.error);

  const handleLogin = async () => {
    dispatch(clearError());  
    try {
      const response = await axios.post('/api/login/', { username, password });
      const { token } = response.data;

      const userResponse = await axios.get('/api/user-info/', {
        headers: { 'Authorization': `Token ${token}` },
      });

      dispatch(setUser({ token, user: userResponse.data }));

      localStorage.setItem('token', token);

      if (userResponse.data.is_superuser) {
        navigate('/admin-dashboard');
      } else {
        navigate('/products');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      dispatch(setError(error.response?.data?.error || 'Login failed'));
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
