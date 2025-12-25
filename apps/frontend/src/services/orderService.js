import api from './api';

const orderService = {
  // get all orders with pagination
  getAll: async (limit = 10, skip = 0, status = null) => {
    const params = new URLSearchParams({ limit: limit.toString(), skip: skip.toString() });
    if (status) params.append('status', status);
    const response = await api.get(`/orders?${params.toString()}`);
    const orders = Array.isArray(response.data) ? response.data : [];
    return {
      orders,
      total: orders.length,
    };
  },

  // get order by id
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // update order
  update: async (id, orderData) => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  },

  // delete order
  delete: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
};

export default orderService;

