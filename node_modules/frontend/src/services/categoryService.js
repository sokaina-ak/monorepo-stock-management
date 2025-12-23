import api from './api';

export const categoryService = {
  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  },

  async getMainCategories() {
    const response = await api.get('/categories/main');
    return response.data;
  },

  async getSubcategories(parentSlug) {
    const response = await api.get(`/categories/${parentSlug}/subcategories`);
    return response.data;
  },

  async getCategory(id) {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  async createCategory(categoryData) {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  async updateCategory(id, categoryData) {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  async deleteCategory(id) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export default categoryService;

