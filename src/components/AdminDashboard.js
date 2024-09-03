import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '' });
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [editProduct, setEditProduct] = useState({ name: '', description: '', price: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/products/', {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
      }
    };

    fetchProducts();
  }, []);

  const handleCreateProduct = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      const data = await response.json();
      setProducts([...products, data]);
      setNewProduct({ name: '', description: '', price: '' });
    } catch (error) {
      console.error('Error creating product:', error);
      setError(error.message);
    }
  };

  const handleUpdateProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(editProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const updatedProduct = await response.json();
      setProducts(products.map(product => (product.id === id ? updatedProduct : product)));
      setIsEditing(null);
      setEditProduct({ name: '', description: '', price: '' });
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error.message);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/products/csv/', {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download CSV');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      setError(error.message);
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
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={newProduct.description}
        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={newProduct.price}
        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
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
                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  />
                  <input
                    type="text"
                    value={editProduct.description}
                    onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                  />
                  <input
                    type="number"
                    value={editProduct.price}
                    onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                  />
                  <button onClick={() => handleUpdateProduct(product.id)}>Save</button>
                </>
              ) : (
                <>
                  {product.name}: ${product.price}
                  <button onClick={() => { setIsEditing(product.id); setEditProduct({ name: product.name, description: product.description, price: product.price }); }}>Edit</button>
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
