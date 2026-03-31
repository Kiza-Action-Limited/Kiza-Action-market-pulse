// src/pages/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaBan, FaCheckCircle, FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { mockAdminProducts } from '../data/mockData';
import { disableMockData, isMockDataEnabled } from '../utils/mockDataControl';
import { formatCurrency } from '../utils/formatters';

const AdminProducts = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data.products);
      setUsingMockData(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      if (isMockDataEnabled()) {
        setProducts(mockAdminProducts);
        setUsingMockData(true);
        toast.success('Showing mock products for UI appearance');
      } else {
        toast.error('Failed to load products');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStatus = async (productId, isActive) => {
    if (usingMockData) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, isActive: !isActive } : product
        )
      );
      toast.success(isActive ? 'Mock product deactivated' : 'Mock product activated');
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/admin/products/${productId}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(isActive ? 'Product deactivated' : 'Product activated');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update product status');
    }
  };

  const removeMockData = () => {
    disableMockData();
    setUsingMockData(false);
    setProducts([]);
    toast.success('Mock data disabled. Admin can enable real data from backend only.');
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                          product.seller?.businessName?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && product.isActive) ||
                         (filter === 'inactive' && !product.isActive);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Products</h1>

      {usingMockData && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 flex items-center justify-between">
          <p className="text-amber-900 text-sm">
            Mock products are shown for appearance only. Remove them any time before production.
          </p>
          <button onClick={removeMockData} className="px-3 py-2 text-sm rounded-md bg-amber-600 text-white hover:bg-amber-700">
            Remove Mock Data
          </button>
        </div>
      )}
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-50">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product or seller..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Products</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 relative">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                product.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {product.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{product.seller?.businessName}</p>
              <p className="text-primary font-bold text-xl mb-2">{formatCurrency(product.price)}</p>
              <p className="text-sm text-gray-500 mb-3">Stock: {product.stock}</p>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleProductStatus(product.id, product.isActive)}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-2 ${
                    product.isActive 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {product.isActive ? <FaBan /> : <FaCheckCircle />}
                  <span>{product.isActive ? 'Deactivate' : 'Activate'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
