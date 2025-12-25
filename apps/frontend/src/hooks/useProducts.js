import { useState, useEffect, useCallback } from 'react';
import productService from '../services/productService';


function useProducts(initialLimit = 12) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // pagination state
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);
  
  // search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // category filter state
  const [category, setCategory] = useState('all');
  
  // stock filter state (null, 'inStock', 'lowStock', 'outOfStock')
  const [stockFilter, setStockFilter] = useState(null);

  // fetch products based on current filters and pagination
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // if stock filter is active, we need to fetch all products for client-side filtering
      // if no filters at all, fetch all to get total count, then paginate
      // otherwise use normal pagination
      const hasNoFilters = !stockFilter && !searchQuery.trim() && (!category || category === 'all');
      const shouldFetchAll = stockFilter !== null || hasNoFilters;
      const fetchLimit = shouldFetchAll ? 10000 : limit;
      const skip = shouldFetchAll ? 0 : (page - 1) * limit;
      
      let data;
      // handle search + category filter together
      if (searchQuery.trim() && category && category !== 'all') {
        // search within a specific category - fetch category products then filter by search term
        setIsSearching(true);
        data = await productService.getByCategory(category, fetchLimit, skip);
        // filter by search query on the client side
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
        // search only (no category filter, but stock filter might be active)
        setIsSearching(true);
        data = await productService.search(searchQuery.trim(), fetchLimit, skip);
      } else {
        // show all products (no search, no category filter)
        setIsSearching(false);
        data = await productService.getAll(fetchLimit, skip);
      }

      let products = data.products || [];

      // apply stock filter if active (works with search and category filters)
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

      // store total count before pagination
      const filteredTotal = products.length;

      // apply pagination to filtered results if we fetched all products
      if (shouldFetchAll) {
        const startIndex = (page - 1) * limit;
        products = products.slice(startIndex, startIndex + limit);
      }

      setProducts(products);
      // set total count - use filtered total for client-side filtering, otherwise estimate
      if (stockFilter || hasNoFilters) {
        setTotal(filteredTotal);
      } else if (searchQuery.trim() && category && category !== 'all') {
        setTotal(filteredTotal);
      } else {
        // for normal pagination, estimate total based on returned products
        // if we got a full page, assume there might be more
        const estimatedTotal = products.length === limit ? (page * limit) + 1 : (page - 1) * limit + products.length;
        setTotal(Math.max(filteredTotal, estimatedTotal));
      }

    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery, category, stockFilter]);

  // fetch products whenever dependencies change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // search handler
  const search = useCallback((query) => {
    setSearchQuery(query);
    // keep other filters active when searching
    setPage(1);
  }, []);

  // category filter handler
  const filterByCategory = useCallback((cat) => {
    setCategory(cat);
    setSearchQuery(''); // clear search when changing category
    // keep stock filter active
    setPage(1);
  }, []);

  // stock filter handler (toggles off if same filter clicked)
  const filterByStock = useCallback((filter) => {
    setStockFilter(filter === stockFilter ? null : filter);
    setSearchQuery(''); // clear search when filtering by stock
    // keep category filter active
    setPage(1);
  }, [stockFilter]);

  // clear all filters and reset to default
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setCategory('all');
    setStockFilter(null);
    setPage(1);
  }, []);

  // pagination handler
  const goToPage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  // delete product handler
  const deleteProduct = useCallback(async (id) => {
    await productService.delete(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setTotal((prev) => prev - 1);
  }, []);

  // calculate pagination values
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    // product data
    products,
    loading,
    error,

    // pagination
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

    // category filter
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
