// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaUsers, FaBox, FaShoppingCart, FaDollarSign, FaBan, FaCheckCircle, FaBrain, FaChartLine, FaBell, FaTag, FaStore, FaTruck } from 'react-icons/fa';
import { formatCurrency } from '../utils/formatters';
import { disableMockData, enableMockData, isMockDataEnabled } from '../utils/mockDataControl';

const AdminDashboard = ({ section = 'dashboard' }) => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [mockEnabled, setMockEnabled] = useState(isMockDataEnabled());

  useEffect(() => {
    fetchData();
  }, [section]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (section) {
        case 'dashboard':
          const statsRes = await axios.get('http://localhost:5000/api/admin/stats', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setStats(statsRes.data);
          break;
        case 'users':
          const usersRes = await axios.get('http://localhost:5000/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUsers(usersRes.data.users);
          break;
        case 'categories':
          const categoriesRes = await axios.get('http://localhost:5000/api/categories');
          setCategories(categoriesRes.data.categories);
          break;
        case 'orders':
          const ordersRes = await axios.get('http://localhost:5000/api/admin/orders', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setOrders(ordersRes.data.orders);
          break;
        case 'products':
          const productsRes = await axios.get('http://localhost:5000/api/admin/products', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProducts(productsRes.data.products);
          break;
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId, block) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/block`,
        { block },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/categories',
        newCategory,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCategory({ name: '', description: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`http://localhost:5000/api/categories/${categoryId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316]"></div>
      </div>
    );
  }

  if (section === 'dashboard') {
    const dashboardStats = [
      { icon: FaUsers, label: 'Total Users', value: stats.totalUsers, color: '#F97316', bgColor: 'bg-[#F97316]/10' },
      { icon: FaBox, label: 'Total Products', value: stats.totalProducts, color: '#FB923C', bgColor: 'bg-[#FB923C]/10' },
      { icon: FaShoppingCart, label: 'Total Orders', value: stats.totalOrders, color: '#16A34A', bgColor: 'bg-[#16A34A]/10' },
      { icon: FaDollarSign, label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), color: '#F97316', bgColor: 'bg-[#F97316]/10' },
      { icon: FaBell, label: 'Pending Orders', value: stats.pendingOrders, color: '#F97316', bgColor: 'bg-[#F97316]/10' },
    ];

    return (
      <div className="bg-[#F9FAFB] min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <FaBrain className="text-[#FB923C] text-3xl" />
              <h1 className="text-3xl font-bold text-[#F97316]">Admin Dashboard</h1>
            </div>
            <p className="text-[#6B7280]">Lango MarketPulse Trade & Intelligence OS — Platform Overview</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {dashboardStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B7280] text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-[#111827] mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                    <stat.icon className="text-2xl" style={{ color: stat.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Intelligence Summary */}
          <div className="mt-8 bg-linear-to-r from-[#F97316] to-[#FB923C] rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <FaChartLine className="text-2xl" />
              <h3 className="text-xl font-semibold">Platform Intelligence</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-white/80 text-sm">Active Sellers</p>
                <p className="text-2xl font-bold">{Math.floor(stats.totalUsers * 0.3)}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">Avg. Order Value</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue / (stats.totalOrders || 1))}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold">24.8%</p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-[#111827] mb-2">B2B Mock Network Data</h3>
            <p className="text-sm text-[#6B7280] mb-4">
              Use this only while real business/supplier data is still growing. Admin can disable it when production data is sufficient.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-xs px-2 py-1 rounded-full ${mockEnabled ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-gray-200 text-gray-700'}`}>
                {mockEnabled ? 'Mock Data Enabled' : 'Mock Data Disabled'}
              </span>
              <button
                type="button"
                onClick={() => {
                  enableMockData();
                  setMockEnabled(true);
                }}
                className="px-4 py-2 rounded-lg border border-[#16A34A] text-[#16A34A] text-sm font-medium hover:bg-[#16A34A]/10"
              >
                Enable Mock Data
              </button>
              <button
                type="button"
                onClick={() => {
                  disableMockData();
                  setMockEnabled(false);
                }}
                className="px-4 py-2 rounded-lg border border-[#F97316] text-[#F97316] text-sm font-medium hover:bg-[#F97316]/10"
              >
                Disable Mock Data
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'users') {
    return (
      <div className="bg-[#F9FAFB] min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <FaUsers className="text-[#F97316] text-3xl" />
              <h1 className="text-3xl font-bold text-[#F97316]">Manage Users</h1>
            </div>
            <p className="text-[#6B7280]">Lango Lako la Biashara Smart — Manage platform users and their access</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto overscroll-x-contain pb-1">
              <table className="w-full min-w-215">
                <thead className="bg-[#F97316] text-white">
                  <tr className="text-left">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Business Type</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                   </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} className={`border-t border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4 font-medium text-[#111827]">{user.name}</td>
                      <td className="px-6 py-4 text-[#6B7280]">{user.email}</td>
                      <td className="px-6 py-4 capitalize">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'admin' ? 'bg-[#FB923C]/10 text-[#FB923C]' :
                          user.role === 'seller' ? 'bg-[#F97316]/10 text-[#F97316]' :
                          'bg-[#16A34A]/10 text-[#16A34A]'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#6B7280]">{user.businessType || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-[#16A34A]/10 text-[#16A34A]'
                        }`}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleBlockUser(user.id, !user.isBlocked)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            user.isBlocked 
                              ? 'bg-[#16A34A] text-white hover:bg-[#16A34A]/90' 
                              : 'bg-[#F97316] text-white hover:bg-[#F97316]/90'
                          }`}
                        >
                          {user.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'categories') {
    return (
      <div className="bg-[#F9FAFB] min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <FaTag className="text-[#FB923C] text-3xl" />
              <h1 className="text-3xl font-bold text-[#F97316]">Manage Categories</h1>
            </div>
            <p className="text-[#6B7280]">Organize your marketplace with structured categories</p>
          </div>
          
          {/* Add Category Form */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border-l-4 border-[#F97316]">
            <h2 className="text-xl font-semibold mb-4 text-[#111827]">Add New Category</h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Category Name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                />
              </div>
              <div>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Description"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB923C] focus:border-transparent"
                />
              </div>
              <button type="submit" className="px-6 py-2 bg-[#F97316] text-white rounded-lg font-semibold hover:bg-[#F97316]/90 transition-colors">
                Add Category
              </button>
            </form>
          </div>
          
          {/* Categories List */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto overscroll-x-contain pb-1">
              <table className="w-full min-w-190">
                <thead className="bg-[#F97316] text-white">
                  <tr className="text-left">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Products Count</th>
                    <th className="px-6 py-3">Actions</th>
                   </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={category.id} className={`border-t border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4 font-semibold text-[#111827]">{category.name}</td>
                      <td className="px-6 py-4 text-[#6B7280]">{category.description || '-'}</td>
                      <td className="px-6 py-4 text-[#6B7280]">{category.productCount || 0}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-500 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'orders') {
    return (
      <div className="bg-[#F9FAFB] min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <FaTruck className="text-[#16A34A] text-3xl" />
              <h1 className="text-3xl font-bold text-[#F97316]">Manage Orders</h1>
            </div>
            <p className="text-[#6B7280]">Track and manage all platform orders</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto overscroll-x-contain pb-1">
              <table className="w-full min-w-205">
                <thead className="bg-[#F97316] text-white">
                  <tr className="text-left">
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Actions</th>
                   </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.id} className={`border-t border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4 font-mono text-sm text-[#FB923C]">#{order.id.slice(-8)}</td>
                      <td className="px-6 py-4 text-[#111827]">{order.customer?.name || 'Guest'}</td>
                      <td className="px-6 py-4 font-semibold text-[#16A34A]">{formatCurrency(order.total)}</td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={async (e) => {
                            try {
                              await axios.put(
                                `http://localhost:5000/api/admin/orders/${order.id}/status`,
                                { status: e.target.value },
                                { headers: { Authorization: `Bearer ${token}` } }
                              );
                              fetchData();
                            } catch (error) {
                              console.error('Error updating order status:', error);
                            }
                          }}
                          className={`px-2 py-1 rounded-lg text-sm font-medium border ${
                            order.status === 'pending' ? 'border-[#F97316] text-[#F97316]' :
                            order.status === 'processing' ? 'border-[#FB923C] text-[#FB923C]' :
                            order.status === 'shipped' ? 'border-[#F97316] text-[#F97316]' :
                            order.status === 'delivered' ? 'border-[#16A34A] text-[#16A34A]' :
                            'border-red-500 text-red-500'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-[#6B7280] text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <button className="text-[#F97316] hover:text-[#FB923C] font-medium">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'products') {
    return (
      <div className="bg-[#F9FAFB] min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <FaBox className="text-[#F97316] text-3xl" />
              <h1 className="text-3xl font-bold text-[#F97316]">Manage Products</h1>
            </div>
            <p className="text-[#6B7280]">Oversee all products listed on the platform</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto overscroll-x-contain pb-1">
              <table className="w-full min-w-215">
                <thead className="bg-[#F97316] text-white">
                  <tr className="text-left">
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3">Seller</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Stock</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                   </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id} className={`border-t border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.images?.[0] || 'https://via.placeholder.com/40'}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                          <span className="font-medium text-[#111827]">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#6B7280]">{product.seller?.businessName || product.seller?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 font-semibold text-[#16A34A]">{formatCurrency(product.price)}</td>
                      <td className="px-6 py-4 text-[#111827]">{product.stock}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          product.isActive ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={async () => {
                            try {
                              await axios.put(
                                `http://localhost:5000/api/admin/products/${product.id}/toggle`,
                                {},
                                { headers: { Authorization: `Bearer ${token}` } }
                              );
                              fetchData();
                            } catch (error) {
                              console.error('Error toggling product:', error);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            product.isActive 
                              ? 'bg-red-500 text-white hover:bg-red-600' 
                              : 'bg-[#16A34A] text-white hover:bg-[#16A34A]/90'
                          }`}
                        >
                          {product.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AdminDashboard;
