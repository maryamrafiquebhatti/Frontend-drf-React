
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.auth.error);

  const [userData, setUserData] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    try {
      await dispatch(registerUser(userData));
      navigate('/login'); 
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={userData.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userData.password}
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
