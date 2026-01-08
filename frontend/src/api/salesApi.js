import api from './axios';

export const salesApi = {
  getAllSales: async (skip = 0, limit = 100) => {
    const response = await api.get(`/sales/?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  getSaleById: async (id) => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },

  createSale: async (saleData) => {
    const response = await api.post('/sales/', saleData);
    return response.data;
  },

  updateSale: async (id, saleData) => {
    const response = await api.put(`/sales/${id}`, saleData);
    return response.data;
  },

  deleteSale: async (id) => {
    const response = await api.delete(`/sales/${id}`);
    return response.data;
  },

  getSalesByUser: async (userId) => {
    const response = await api.get(`/sales/user/${userId}`);
    return response.data;
  },

  getSalesByProduct: async (productId) => {
    const response = await api.get(`/sales/product/${productId}`);
    return response.data;
  },

  getSalesByDateRange: async (startDate, endDate) => {
    const response = await api.get(
      `/sales/date-range/?start_date=${startDate}&end_date=${endDate}`
    );
    return response.data;
  },

  getTotalAmount: async (startDate = null, endDate = null) => {
    let url = '/sales/stats/total-amount';
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }
    const response = await api.get(url);
    return response.data;
  },
};