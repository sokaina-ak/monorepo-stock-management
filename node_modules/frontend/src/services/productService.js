import api from './api';

const productService = {
  // get all products with pagination
  getAll: async (limit = 10, skip = 0) => {
    const response = await api.get(`/products?limit=${limit}&skip=${skip}`);
    // backend returns array directly
    const products = Array.isArray(response.data) ? response.data : [];
    return {
      products,
      total: products.length, // backend doesn't return total, so use array length for now
    };
  },
  
  // search products with pagination
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
  
  // get list of categories
  getCategories: async () => {
    const response = await api.get('/products/category-list');
    // backend returns array of category objects with id, name, slug, parent
    const categories = response.data;
    if (!Array.isArray(categories)) {
      console.warn('categories response is not an array:', categories);
      return [];
    }
    // extract slugs from category objects and filter out null/undefined values
    const slugs = categories
      .map(cat => {
        if (typeof cat === 'string') return cat;
        return cat.slug || cat.name || null;
      })
      .filter(cat => cat !== null && cat !== undefined);
    return slugs;
  },
  
  // get products by category with pagination
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
