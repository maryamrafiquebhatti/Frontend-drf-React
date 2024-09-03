import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import ProductList from './components/ProductList';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import Register from './components/Register';
import axios from 'axios';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    if (token) {
      axios.get('/api/user-info/', {
        headers: {
          Authorization: `Token ${token}`
        }
      }).then(response => {
        setIsSuperuser(response.data.is_superuser);
      }).catch(() => {
        setToken(null);
        localStorage.removeItem('token');
      });
    }
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={token ? <ProductList token={token} isSuperuser={isSuperuser} /> : <Navigate to="/login" />} />
        <Route path="/admin-dashboard" element={token && isSuperuser ? <AdminDashboard token={token} /> : <Navigate to="/login" />} />
        
      </Routes>
    </Router>
  );
}

export default App;
