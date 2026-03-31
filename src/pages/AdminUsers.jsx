// src/pages/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaBan, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { mockAdminUsers } from '../data/mockData';
import { disableMockData, isMockDataEnabled } from '../utils/mockDataControl';

const AdminUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
      setUsingMockData(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      if (isMockDataEnabled()) {
        setUsers(mockAdminUsers);
        setUsingMockData(true);
        toast.success('Showing mock users for UI appearance');
      } else {
        toast.error('Failed to load users');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId, block) => {
    if (usingMockData) {
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, isBlocked: block } : user))
      );
      toast.success(block ? 'Mock user blocked' : 'Mock user unblocked');
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/block`,
        { block },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(block ? 'User blocked' : 'User unblocked');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const removeMockData = () => {
    disableMockData();
    setUsingMockData(false);
    setUsers([]);
    toast.success('Mock data disabled. Admin can switch to real backend data anytime.');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
                          user.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && !user.isBlocked) ||
                         (filter === 'blocked' && user.isBlocked) ||
                         (filter === user.role);
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
      <h1 className="text-3xl font-bold mb-8">Manage Users</h1>

      {usingMockData && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 flex items-center justify-between">
          <p className="text-amber-900 text-sm">
            Mock users are shown for appearance only. Remove them before production.
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
                placeholder="Search by name or email..."
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
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
            <option value="buyer">Buyers</option>
            <option value="seller">Sellers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Business Type</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4 capitalize">{user.role}</td>
                  <td className="px-6 py-4">{user.businessType || '-'}</td>
                  <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${!user.isBlocked ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleBlockUser(user.id, !user.isBlocked)}
                      className={`px-3 py-1 rounded text-sm flex items-center space-x-1 ${
                        user.isBlocked 
                          ? 'bg-green-500 text-white hover:bg-green-600' 
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                    >
                      {user.isBlocked ? <FaCheckCircle /> : <FaBan />}
                      <span>{user.isBlocked ? 'Unblock' : 'Block'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
