
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setProducts,
  setError,
  clearError,
  setNewProduct,
  setEditProduct,
  setIsEditing,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../features/adminDashboard/adminDashboardSlice';
import axios from 'axios';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { products, newProduct, editProduct, error, isEditing } = useSelector((state) => state.adminDashboard);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(clearError());
      try {
        const response = await axios.get('/api/products/', {
          headers: { 'Authorization': `Token ${localStorage.getItem('token')}` },
        });
        dispatch(setProducts(response.data));
      } catch (error) {
        dispatch(setError(error.response?.data?.error || 'Error fetching products'));
      }
    };

    fetchProducts();
  }, [dispatch]);

  const handleCreateProduct = async () => {
    dispatch(clearError());
    try {
      const response = await axios.post('/api/products/', newProduct, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      });
      dispatch(addProduct(response.data));
      dispatch(setNewProduct({ name: '', description: '', price: '' }));
    } catch (error) {
      dispatch(setError(error.response?.data?.error || 'Error creating product'));
    }
  };

  const handleUpdateProduct = async (id) => {
    dispatch(clearError());
    try {
      const response = await axios.put(`/api/products/${id}/`, editProduct, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      });
      dispatch(updateProduct(response.data));
      dispatch(setIsEditing(null));
      dispatch(setEditProduct({ name: '', description: '', price: '' }));
    } catch (error) {
      dispatch(setError(error.response?.data?.error || 'Error updating product'));
    }
  };

  const handleDeleteProduct = async (id) => {
    dispatch(clearError());
    try {
      await axios.delete(`/api/products/${id}/`, {
        headers: { 'Authorization': `Token ${localStorage.getItem('token')}` },
      });
      dispatch(deleteProduct(id));
    } catch (error) {
      dispatch(setError(error.response?.data?.error || 'Error deleting product'));
    }
  };

  const handleDownloadCSV = async () => {
    dispatch(clearError());
    try {
      const response = await axios.get('/api/products/csv/', {
        headers: { 'Authorization': `Token ${localStorage.getItem('token')}` },
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      dispatch(setError(error.response?.data?.error || 'Error downloading CSV'));
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {error && <p>{error}</p>}
      
      <h3>Create New Product</h3>
      <input
        type="text"
        placeholder="Name"
        value={newProduct.name}
        onChange={(e) => dispatch(setNewProduct({ ...newProduct, name: e.target.value }))}
      />
      <input
        type="text"
        placeholder="Description"
        value={newProduct.description}
        onChange={(e) => dispatch(setNewProduct({ ...newProduct, description: e.target.value }))}
      />
      <input
        type="number"
        placeholder="Price"
        value={newProduct.price}
        onChange={(e) => dispatch(setNewProduct({ ...newProduct, price: e.target.value }))}
      />
      <button onClick={handleCreateProduct}>Add Product</button>

      <h3>Product List</h3>
      <ul>
        {products.length > 0 ? (
          products.map(product => (
            <li key={product.id}>
              {isEditing === product.id ? (
                <>
                  <input
                    type="text"
                    value={editProduct.name}
                    onChange={(e) => dispatch(setEditProduct({ ...editProduct, name: e.target.value }))}
                  />
                  <input
                    type="text"
                    value={editProduct.description}
                    onChange={(e) => dispatch(setEditProduct({ ...editProduct, description: e.target.value }))}
                  />
                  <input
                    type="number"
                    value={editProduct.price}
                    onChange={(e) => dispatch(setEditProduct({ ...editProduct, price: e.target.value }))}
                  />
                  <button onClick={() => handleUpdateProduct(product.id)}>Save</button>
                </>
              ) : (
                <>
                  {product.name}: ${product.price}
                  <button onClick={() => { 
                    dispatch(setIsEditing(product.id)); 
                    dispatch(setEditProduct({ name: product.name, description: product.description, price: product.price })); 
                  }}>Edit</button>
                  <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                </>
              )}
            </li>
          ))
        ) : (
          <p>No products available</p>
        )}
      </ul>

      <button onClick={handleDownloadCSV}>Download CSV</button>
    </div>
  );
};

export default AdminDashboard;
