import api from './axios';

export const productApi = {
  getAllProducts: async (skip = 0, limit = 100) => {
    const response = await api.get(`/products/?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await api.post('/products/', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  searchProducts: async (query) => {
    const response = await api.get(`/products/search/?q=${query}`);
    return response.data;
  },

  checkStock: async (id, quantity) => {
    const response = await api.get(`/products/${id}/stock-check?quantity=${quantity}`);
    return response.data;
  },
};