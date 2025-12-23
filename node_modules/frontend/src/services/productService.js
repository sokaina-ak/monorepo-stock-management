import api from './api';

const productService = {
  //numbers of cards can see
  getAll: async (limit = 10, skip = 0) => {
    const response = await api.get(`/products?limit=${limit}&skip=${skip}`);
    // Backend returns array directly
    const products = Array.isArray(response.data) ? response.data : [];
    return {
      products,
      total: products.length, // Backend doesn't return total, use length for now
    };
  },
  //search and formate pagination
  search: async (query, limit = 10, skip = 0) => {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);
    const products = Array.isArray(response.data) ? response.data : [];
    return {
      products,
      total: products.length,
    };
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  getCategories: async () => {
    const response = await api.get('/products/category-list');
    // Backend returns array of category objects with id, name, slug, parent
    const categories = response.data;
    console.log('productService.getCategories - Raw response:', categories); // Debug log
    if (!Array.isArray(categories)) {
      console.warn('Categories response is not an array:', categories);
      return [];
    }
    // Extract slugs from category objects, filter out null/undefined
    const slugs = categories
      .map(cat => {
        if (typeof cat === 'string') return cat;
        return cat.slug || cat.name || null;
      })
      .filter(cat => cat !== null && cat !== undefined);
    console.log('productService.getCategories - Extracted slugs:', slugs); // Debug log
    return slugs;
  },
  getByCategory: async (category, limit = 10, skip = 0) => {
    const response = await api.get(`/products/category/${category}?limit=${limit}&skip=${skip}`);
    const products = Array.isArray(response.data) ? response.data : [];
    return {
      products,
      total: products.length,
    };
  },
  
  create: async (productData) => {
    const response = await api.post('/products/add', productData);
    return response.data;
  },
  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default productService;
