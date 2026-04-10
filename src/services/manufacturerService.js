import api from '../config/axios';

const firstSuccess = async (requests = []) => {
  for (const request of requests) {
    try {
      const result = await request();
      return result;
    } catch (error) {
      // Try next candidate endpoint.
    }
  }
  throw new Error('All endpoint candidates failed');
};

export const manufacturerService = {
  getMarketplaceData: async () => {
    const [categoriesRes, productsRes] = await Promise.all([
      api.get('/categories'),
      api.get('/products', { params: { limit: 120 } }),
    ]);

    return {
      categories: categoriesRes.data?.categories || [],
      products: productsRes.data?.products || [],
    };
  },

  predictSuppliers: async (payload) => {
    const response = await api.post('/ai/predict/suppliers', payload);
    return response.data;
  },

  getHubHeaderConfig: async () => {
    const response = await firstSuccess([
      () => api.get('/business-hub/header'),
      () => api.get('/platform/header-config'),
      () => api.get('/marketplace/header'),
    ]);

    return response.data;
  },

  searchBusinesses: async ({ query = '', category = '', businessType = '', limit = 120 } = {}) => {
    const params = { query, q: query, search: query, category, businessType, limit };

    const response = await firstSuccess([
      () => api.get('/business-hub/search', { params }),
      () => api.get('/businesses/search', { params }),
      () => api.get('/suppliers/search', { params }),
      () => api.get('/products', { params: { search: query, category, limit } }),
    ]);

    return response.data;
  },

  searchByImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await firstSuccess([
      () => api.post('/business-hub/search/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
      () => api.post('/ai/search/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
      () => api.post('/products/search-by-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    ]);

    return response.data;
  },
};
