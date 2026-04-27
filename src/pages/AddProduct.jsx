// src/pages/AddProduct.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaBrain, FaChartLine, FaBell, FaStore, FaImage, FaTag, FaLayerGroup } from 'react-icons/fa';

const AddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    images: [],
    variants: []
  });
  const fallbackCategories = [
    { id: 'electronics', name: 'Electronics' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'home-garden', name: 'Home & Garden' },
    { id: 'beauty-health', name: 'Beauty & Health' },
    { id: 'sports-outdoor', name: 'Sports & Outdoor' },
    { id: 'food-grocery', name: 'Food & Grocery' },
    { id: 'automotive', name: 'Automotive' },
    { id: 'baby-kids', name: 'Baby & Kids' },
  ];

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      const product = response.data.product;
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        images: product.images || [],
        variants: product.variants || []
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you would upload these to a cloud storage service
    // For now, we'll use local URLs
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData({
      ...formData,
      images: [...formData.images, ...imageUrls]
    });
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { name: '', price: '', stock: '' }]
    });
  };

  const updateVariant = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index][field] = value;
    setFormData({
      ...formData,
      variants: updatedVariants
    });
  };

  const removeVariant = (index) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (id) {
        await axios.put(
          `http://localhost:5000/api/products/${id}`,
          productData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Product updated successfully');
      } else {
        await axios.post(
          'http://localhost:5000/api/products',
          productData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Product added successfully');
      }
      navigate('/seller');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.length
    ? categories.map((cat) => ({
        id: cat.id || cat._id || cat.value,
        name: cat.name || cat.title || 'Unnamed Category',
      }))
    : fallbackCategories;

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header with Lango MarketPulse branding */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaStore className="text-[#F97316] text-3xl" />
            <h1 className="text-3xl font-bold text-[#F97316]">
              {id ? 'Edit Product' : 'Add New Product'}
            </h1>
          </div>
          <p className="text-[#6B7280]">
            Lango Lako la Biashara Smart — List your products and reach customers across Kenya
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#F97316]">
            <div className="flex items-center gap-2 mb-4">
              <FaTag className="text-[#F97316] text-xl" />
              <h2 className="text-xl font-semibold text-[#111827]">Basic Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#111827]">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-[#111827]">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                  placeholder="Describe your product in detail"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#111827]">Price (KSh)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#111827]">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-[#111827]">Category</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB923C] focus:border-transparent"
                >
                 
                  <option value="">
                    Select a category (e.g., Electronics, Fashion, Home)
                  </option>
                  {categoryOptions.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Images */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#FB923C]">
            <div className="flex items-center gap-2 mb-4">
              <FaImage className="text-[#FB923C] text-xl" />
              <h2 className="text-xl font-semibold text-[#111827]">Product Images</h2>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-[#111827]">Upload Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full text-sm text-[#6B7280] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#F97316] file:text-white hover:file:bg-[#F97316]/90"
              />
              <p className="text-xs text-[#6B7280] mt-1">Upload up to 10 images (JPG, PNG, WebP)</p>
            </div>
            
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-opacity opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Variants */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#F97316]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <FaLayerGroup className="text-[#F97316] text-xl" />
                <h2 className="text-xl font-semibold text-[#111827]">Variants (Optional)</h2>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="text-[#F97316] hover:text-[#F97316]/80 font-medium flex items-center gap-1"
              >
                + Add Variant
              </button>
            </div>
            
            {formData.variants.length === 0 && (
              <p className="text-[#6B7280] text-sm text-center py-4 bg-gray-50 rounded-lg">
                No variants added. Click "Add Variant" to create size, color, or other options.
              </p>
            )}
            
            {formData.variants.map((variant, index) => (
              <div key={index} className="border-t border-gray-200 pt-4 mt-4 first:border-0 first:pt-0">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-[#111827]">Variant {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#111827]">Variant Name</label>
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) => updateVariant(index, 'name', e.target.value)}
                      placeholder="e.g., Small, Red, 1kg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB923C] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#111827]">Price (KSh)</label>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => updateVariant(index, 'price', e.target.value)}
                      placeholder="Price"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#111827]">Stock</label>
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                      placeholder="Stock"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* AI Intelligence Tip */}
          <div className="bg-linear-to-r from-[#FB923C]/10 to-[#F97316]/10 rounded-xl p-4 border border-[#FB923C]/20">
            <div className="flex items-start gap-3">
              <FaBrain className="text-[#FB923C] text-xl mt-0.5" />
              <div>
                <h4 className="font-semibold text-[#111827] mb-1">AI Intelligence Tip</h4>
                <p className="text-sm text-[#6B7280]">
                  Products with high-quality images and detailed descriptions get <span className="text-[#16A34A] font-medium">40% more views</span>. 
                  Add variants to reach customers looking for specific options.
                </p>
              </div>
            </div>
          </div>
          
          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/seller')}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-[#111827] hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-[#F97316] text-white rounded-lg font-semibold hover:bg-[#F97316]/90 transition-colors disabled:opacity-50 shadow-md"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {id ? 'Updating...' : 'Adding...'}
                </span>
              ) : (
                id ? 'Update Product' : 'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
