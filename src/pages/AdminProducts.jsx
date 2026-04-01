// src/pages/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaBan, FaCheckCircle, FaSearch, FaBox, FaStore, FaChartLine, FaBrain, FaFilter } from 'react-icons/fa';
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

  // Calculate statistics
  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    inactive: products.filter(p => !p.isActive).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                          product.seller?.businessName?.toLowerCase().includes(search.toLowerCase()) ||
                          product.seller?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && product.isActive) ||
                         (filter === 'inactive' && !product.isActive);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaBox className="text-[#F97316] text-3xl" />
            <h1 className="text-3xl font-bold text-[#F97316]">Manage Products</h1>
          </div>
          <p className="text-[#6B7280]">Lango Lako la Biashara Smart — Oversee all products listed on the platform</p>
        </div>

        {usingMockData && (
          <div className="mb-6 rounded-xl border border-[#F97316]/30 bg-[#F97316]/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaBrain className="text-[#F97316]" />
              <p className="text-[#111827] text-sm">
                <span className="font-semibold text-[#F97316]">Mock Mode:</span> Products are shown for appearance only.
              </p>
            </div>
            <button 
              onClick={removeMockData} 
              className="px-3 py-1.5 text-sm rounded-lg bg-[#F97316] text-white hover:bg-[#F97316]/90 transition-colors"
            >
              Remove Mock Data
            </button>
          </div>
        )}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-[#F97316]">
            <p className="text-[#6B7280] text-xs uppercase tracking-wide">Total Products</p>
            <p className="text-2xl font-bold text-[#111827]">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-[#16A34A]">
            <p className="text-[#6B7280] text-xs uppercase tracking-wide">Active Products</p>
            <p className="text-2xl font-bold text-[#16A34A]">{stats.active}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-[#F97316]">
            <p className="text-[#6B7280] text-xs uppercase tracking-wide">Inactive Products</p>
            <p className="text-2xl font-bold text-[#F97316]">{stats.inactive}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-[#FB923C]">
            <p className="text-[#6B7280] text-xs uppercase tracking-wide">Inventory Value</p>
            <p className="text-xl font-bold text-[#FB923C]">{formatCurrency(stats.totalValue)}</p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="Search by product name or seller..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <FaFilter className="text-[#6B7280]" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB923C] focus:border-transparent"
              >
                <option value="all">All Products</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* AI Intelligence Tip */}
        {stats.inactive > stats.active * 0.5 && (
          <div className="mb-6 bg-gradient-to-r from-[#FB923C]/10 to-[#F97316]/10 rounded-xl p-4 border border-[#FB923C]/20">
            <div className="flex items-start gap-3">
              <FaChartLine className="text-[#FB923C] text-xl mt-0.5" />
              <div>
                <h4 className="font-semibold text-[#111827] mb-1">AI Intelligence Insight</h4>
                <p className="text-sm text-[#6B7280]">
                  {stats.inactive} products are currently inactive. Reviewing and reactivating popular items could increase platform revenue by up to <span className="text-[#16A34A] font-medium">15%</span>.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-[#111827] mb-2">No Products Found</h3>
            <p className="text-[#6B7280]">
              {search ? `No results for "${search}"` : 'No products are currently listed'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 duration-300">
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#6B7280]">
                      <FaBox className="text-4xl mb-2" />
                      <span className="text-sm">No Image</span>
                    </div>
                  )}
                  <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${
                    product.isActive 
                      ? 'bg-[#16A34A] text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-1 text-[#111827] line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <FaStore className="text-[#6B7280] text-xs" />
                    <p className="text-[#6B7280] text-sm">{product.seller?.businessName || product.seller?.name || 'Unknown Seller'}</p>
                  </div>
                  <p className="text-[#F97316] font-bold text-xl mb-2">{formatCurrency(product.price)}</p>
                  <p className={`text-sm mb-4 ${product.stock < 10 ? 'text-[#F97316]' : 'text-[#6B7280]'}`}>
                    Stock: {product.stock} {product.stock < 10 && product.stock > 0 && '⚠️ Low stock'}
                  </p>
                  
                  <button
                    onClick={() => toggleProductStatus(product.id, product.isActive)}
                    className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors ${
                      product.isActive 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-[#16A34A] text-white hover:bg-[#16A34A]/90'
                    }`}
                  >
                    {product.isActive ? <FaBan /> : <FaCheckCircle />}
                    <span>{product.isActive ? 'Deactivate Product' : 'Activate Product'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Results Summary */}
        {filteredProducts.length > 0 && (
          <div className="mt-6 text-center text-sm text-[#6B7280]">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
