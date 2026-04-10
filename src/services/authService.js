// src/services/authService.js
import api from '../config/axios';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  checkEmailAccount: async (email) => {
    const payload = { email };

    const readExists = (data) => {
      if (typeof data?.exists === 'boolean') return data.exists;
      if (typeof data?.found === 'boolean') return data.found;
      if (typeof data?.isRegistered === 'boolean') return data.isRegistered;
      if (data?.user && typeof data.user === 'object') return true;
      if (Array.isArray(data?.users)) return data.users.length > 0;
      return false;
    };

    const attempts = [
      () => api.post('/auth/check-email', payload),
      () => api.post('/auth/email-exists', payload),
      () => api.get(`/auth/check-email?email=${encodeURIComponent(email)}`),
    ];

    let lastError = null;
    for (const call of attempts) {
      try {
        const response = await call();
        return { exists: readExists(response?.data), raw: response?.data };
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error('Unable to validate email account');
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  resendVerification: async (email) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  }
};
