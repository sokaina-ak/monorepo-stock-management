import { useState, useEffect, useCallback } from 'react';
import productService from '../services/productService';


function useProducts(initialLimit = 12) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //for pagination 
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);
  //foe search
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  //for category filter 
  const [category, setCategory] = useState('all');
  //for stock filter
  const [stockFilter, setStockFilter] = useState(null); // null, 'inStock', 'lowStock', 'outOfStock'

 //live search
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // If stock filter is active OR search + category filter together, fetch more and filter client-side
      // Otherwise, use pagination
      const shouldFetchAll = stockFilter !== null || (searchQuery.trim() && category && category !== 'all');
      const fetchLimit = shouldFetchAll ? 1000 : limit;
      const skip = shouldFetchAll ? 0 : (page - 1) * limit;
      
      let data;
      // Handle search + category filter together
      if (searchQuery.trim() && category && category !== 'all') {
        // Search within a specific category - fetch category products then filter by search
        setIsSearching(true);
        data = await productService.getByCategory(category, fetchLimit, skip);
        // Filter by search query client-side
        const searchLower = searchQuery.toLowerCase().trim();
        let categoryProducts = data.products || [];
        categoryProducts = categoryProducts.filter(product => 
          product.title?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.brand?.toLowerCase().includes(searchLower)
        );
        data = { products: categoryProducts, total: categoryProducts.length };
      } else if (category && category !== 'all') {
        // filter by category only (no search)
        setIsSearching(false);
        data = await productService.getByCategory(category, fetchLimit, skip);
      } else if (searchQuery.trim()) {
        // search only (no category filter, but stock filter may be active)
        setIsSearching(true);
        data = await productService.search(searchQuery.trim(), fetchLimit, skip);
      } else {
        // all products (no search, no category filter)
        setIsSearching(false);
        data = await productService.getAll(fetchLimit, skip);
      }

      let products = data.products || [];

      // Apply stock filter if active (works with search and category filters)
      if (stockFilter) {
        products = products.filter((product) => {
          const stock = Number(product.stock) || 0;
          switch (stockFilter) {
            case 'inStock':
              return stock > 10;
            case 'lowStock':
              return stock > 0 && stock <= 10;
            case 'outOfStock':
              return stock === 0;
            default:
              return true;
          }
        });
      }

      // Store total before pagination
      const filteredTotal = products.length;

      // Apply pagination to filtered results
      const startIndex = (page - 1) * limit;
      products = products.slice(startIndex, startIndex + limit);

      setProducts(products);
      // Use filtered total if we applied client-side filtering (stock filter or search+category)
      setTotal((stockFilter || (searchQuery.trim() && category && category !== 'all')) ? filteredTotal : (data.total || filteredTotal));

    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery, category, stockFilter]);

  //featch products when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  
  const search = useCallback((query) => {
    setSearchQuery(query);
    // Don't clear filters when searching - allow search + filters to work together
    setPage(1);
  }, []);

  const filterByCategory = useCallback((cat) => {
    setCategory(cat);
    setSearchQuery(''); // clear search when filtering by category
    // Don't clear stock filter - allow category + stock filter to work together
    setPage(1);
  }, []);

  const filterByStock = useCallback((filter) => {
    setStockFilter(filter === stockFilter ? null : filter); // toggle if same filter clicked
    setSearchQuery(''); // clear search when filtering by stock
    // Don't clear category - allow stock filter + category filter to work together
    setPage(1);
  }, [stockFilter]);

  //clear all filters and reload 
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setCategory('all');
    setStockFilter(null);
    setPage(1);
  }, []);

  const goToPage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  //delete
  const deleteProduct = useCallback(async (id) => {
    await productService.delete(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setTotal((prev) => prev - 1);
  }, []);

  //calc pagination 
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    // data
    products,
    loading,
    error,

    // oagination
    page,
    totalPages,
    total,
    hasNextPage,
    hasPrevPage,
    goToPage,

    // search
    searchQuery,
    isSearching,
    search,

    // category
    category,
    filterByCategory,

    // stock filter
    stockFilter,
    filterByStock,

    clearFilters,
    deleteProduct,
    refetch: fetchProducts,
  };
}

export default useProducts;
