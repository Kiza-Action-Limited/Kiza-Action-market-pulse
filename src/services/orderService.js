// src/services/orderService.js
import api from '../config/axios';

export const orderService = {
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  
  cancel: async (id) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },
  
  getTracking: async (id) => {
    const response = await api.get(`/orders/${id}/tracking`);
    return response.data;
  },
};