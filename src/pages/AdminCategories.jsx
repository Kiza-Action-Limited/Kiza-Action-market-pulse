// src/pages/AdminCategories.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaEdit, FaTrash, FaPlus, FaTag, FaStore, FaBrain } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { mockCategories } from '../data/mockData';
import { disableMockData, isMockDataEnabled } from '../utils/mockDataControl';

const AdminCategories = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: ''
  });
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data.categories);
      setUsingMockData(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      if (isMockDataEnabled()) {
        setCategories(mockCategories);
        setUsingMockData(true);
        toast.success('Showing mock categories for UI appearance');
      } else {
        toast.error('Failed to load categories');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (usingMockData) {
      if (editingCategory) {
        setCategories((prev) =>
          prev.map((category) =>
            category.id === editingCategory.id ? { ...category, ...formData } : category
          )
        );
        toast.success('Mock category updated');
      } else {
        setCategories((prev) => [
          ...prev,
          { id: `mock-category-${Date.now()}`, ...formData, productCount: 0 },
        ]);
        toast.success('Mock category added');
      }
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', icon: '' });
      return;
    }

    try {
      if (editingCategory) {
        await axios.put(
          `http://localhost:5000/api/categories/${editingCategory.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Category updated successfully');
      } else {
        await axios.post(
          'http://localhost:5000/api/categories',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Category added successfully');
      }
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', icon: '' });
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      if (usingMockData) {
        setCategories((prev) => prev.filter((category) => category.id !== categoryId));
        toast.success('Mock category deleted');
        return;
      }

      try {
        await axios.delete(`http://localhost:5000/api/categories/${categoryId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon || ''
    });
    setShowModal(true);
  };

  const removeMockData = () => {
    disableMockData();
    setUsingMockData(false);
    setCategories([]);
    toast.success('Mock data disabled. Real backend categories will be used.');
  };

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
        {/* Header with Lango MarketPulse branding */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaTag className="text-[#F97316] text-3xl" />
            <h1 className="text-3xl font-bold text-[#F97316]">Manage Categories</h1>
          </div>
          <p className="text-[#6B7280]">
            Lango Lako la Biashara Smart — Organize your marketplace with structured categories
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <FaStore className="text-[#FB923C]" />
            <span className="text-[#6B7280] text-sm">
              Total Categories: <span className="font-semibold text-[#111827]">{categories.length}</span>
            </span>
          </div>
          <button
            onClick={() => {
              setEditingCategory(null);
              setFormData({ name: '', description: '', icon: '' });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#F97316] text-white rounded-lg font-semibold hover:bg-[#F97316]/90 transition-colors shadow-md"
          >
            <FaPlus size={14} />
            <span>Add Category</span>
          </button>
        </div>

        {usingMockData && (
          <div className="mb-6 rounded-xl border border-[#F97316]/30 bg-[#F97316]/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaBrain className="text-[#F97316]" />
              <p className="text-[#111827] text-sm">
                <span className="font-semibold text-[#F97316]">Mock Mode:</span> Categories are visible for appearance only.
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
        
        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-[#111827] mb-2">No Categories Yet</h3>
            <p className="text-[#6B7280] mb-4">Create your first category to organize products</p>
            <button
              onClick={() => {
                setEditingCategory(null);
                setFormData({ name: '', description: '', icon: '' });
                setShowModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#F97316]/90"
            >
              <FaPlus /> Add Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const gradientColors = [
                'from-[#F97316] to-[#FB923C]',
                'from-[#FB923C] to-[#F97316]',
                'from-[#16A34A] to-[#F97316]',
                'from-[#F97316] to-[#FB923C]',
                'from-[#F97316] to-[#16A34A]',
              ];
              const gradient = gradientColors[index % gradientColors.length];
              
              return (
                <div key={category.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className={`h-28 bg-gradient-to-r ${gradient} flex items-center justify-center`}>
                    <span className="text-5xl">{category.icon || '📦'}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-semibold mb-2 text-[#111827]">{category.name}</h3>
                    <p className="text-[#6B7280] text-sm mb-4 line-clamp-2">{category.description || 'No description provided'}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#6B7280] bg-gray-100 px-2 py-1 rounded-full">
                        {category.productCount || 0} products
                      </span>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-[#F97316] hover:text-[#FB923C] transition-colors"
                          title="Edit category"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete category"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <FaTag className="text-[#F97316] text-xl" />
                <h2 className="text-2xl font-bold text-[#111827]">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#111827]">Category Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                      placeholder="e.g., Electronics, Fashion, Groceries"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#111827]">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB923C] focus:border-transparent"
                      placeholder="Describe what products belong in this category"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#111827]">Icon (emoji)</label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="📦"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                    />
                    <p className="text-xs text-[#6B7280] mt-1">Add an emoji to represent this category</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-[#111827] hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#F97316] text-white rounded-lg font-semibold hover:bg-[#F97316]/90 transition-colors"
                  >
                    {editingCategory ? 'Update' : 'Add Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;