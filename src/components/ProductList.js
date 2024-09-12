import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, setError, clearError } from '../features/products/productsSlice';
import axios from 'axios';

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const error = useSelector((state) => state.products.error);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(clearError()); 
      try {
        const response = await axios.get('/api/products/', {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
        });

        if (!response.status === 200) {
          throw new Error('Failed to fetch products');
        }

        dispatch(setProducts(response.data));
      } catch (error) {
        console.error('Error fetching products:', error);
        dispatch(setError(error.response?.data?.error || 'Error fetching products'));
      }
    };

    fetchProducts();
  }, [dispatch]);

  return (
    <div>
      <h2>Product List</h2>
      {error && <p>{error}</p>}
      <ul>
        {products.length > 0 ? (
          products.map((product) => (
            <li key={product.id}>
              {product.name}: ${product.price}
            </li>
          ))
        ) : (
          <p>No products available</p>
        )}
      </ul>
    </div>
  );
};

export default ProductList;
