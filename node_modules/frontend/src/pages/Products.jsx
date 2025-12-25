import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Sparkles,
} from 'lucide-react';
import useProducts from '../hooks/useProducts';
import { useToast } from '../context/ToastContext';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import noDataIllustration from '../assets/images/undraw_no-data_ig65.svg';
import Button from '../components/common/Button';
import Skeleton from '../components/common/Skeleton';
import Modal from '../components/common/Modal';
import ProductCard from '../components/products/ProductCard';
import ProductTable from '../components/products/ProductTable';
import ViewToggle from '../components/products/ViewToggle';
import styles from './Products.module.css';

function Products() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  // hook for managing product data
  const {
    products,
    loading,
    error,
    page,
    totalPages,
    total,
    hasNextPage,
    hasPrevPage,
    goToPage,
    searchQuery,
    isSearching,
    search,
    category,
    filterByCategory,
    stockFilter,
    filterByStock,
    clearFilters,
    deleteProduct,
  } = useProducts(12);

  // component state
  const [view, setView] = useState(() => {
    return localStorage.getItem('productsView') || 'grid';
  });
  const [searchInput, setSearchInput] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, product: null });
  const [deleting, setDeleting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [productStats, setProductStats] = useState({
    total: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
  });
  // fetch categories list
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // use category service to get full category data
        const data = await categoryService.getCategories();
        // extract slugs from category objects
        if (Array.isArray(data) && data.length > 0) {
          const slugs = data.map(cat => typeof cat === 'string' ? cat : (cat.slug || cat.name));
          setCategories(slugs.filter(slug => slug));
        } else {
          console.warn('No categories found or invalid data format');
          setCategories([]);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        console.error('Error details:', err.response?.data || err.message);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);
  // fetch all products to calculate stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await productService.getAll(200, 0);
        const allProducts = data.products || [];
        const stats = {
          total: data.total || 0,
          inStock: allProducts.filter((p) => (p.stock || 0) > 10).length,
          lowStock: allProducts.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 10).length,
          outOfStock: allProducts.filter((p) => (p.stock || 0) === 0).length,
        };
        setProductStats(stats);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        // use default values if stats fail to load
        setProductStats({
          total: 0,
          inStock: 0,
          lowStock: 0,
          outOfStock: 0,
        });
      }
    };
    fetchStats();
  }, []);

  // stats cards configuration
  const stats = [
    {
      label: 'Total Products',
      value: productStats.total,
      icon: Package,
      color: 'var(--color-accent)',
      bgColor: 'var(--color-accent-light)',
      filterKey: null, // no filter for total count
    },
    {
      label: 'In Stock',
      value: productStats.inStock,
      icon: CheckCircle,
      color: 'var(--color-success)',
      bgColor: 'var(--color-success-light)',
      filterKey: 'inStock',
    },
    {
      label: 'Low Stock',
      value: productStats.lowStock,
      icon: AlertTriangle,
      color: 'var(--color-warning)',
      bgColor: 'var(--color-warning-light)',
      filterKey: 'lowStock',
    },
    {
      label: 'Out of Stock',
      value: productStats.outOfStock,
      icon: XCircle,
      color: 'var(--color-error)',
      bgColor: 'var(--color-error-light)',
      filterKey: 'outOfStock',
    },
  ];

  // debounced search with 300ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim()) {
        search(searchInput);
      } else if (!searchInput && searchQuery) {
        clearFilters();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, search, searchQuery, clearFilters]);

  // save view preference to local storage
  const handleViewChange = (newView) => {
    setView(newView);
    localStorage.setItem('productsView', newView);
  };
  
  // clear search input and filters
  const handleClearSearch = () => {
    setSearchInput('');
    clearFilters();
  };
  
  // handle category filter selection
  const handleCategoryClick = (cat) => {
    setSearchInput('');
    filterByCategory(cat);
  };
  
  // delete modal handlers
  const handleDeleteClick = (product) => {
    setDeleteModal({ open: true, product });
  };
  const closeDeleteModal = () => {
    setDeleteModal({ open: false, product: null });
  };
  const handleConfirmDelete = async () => {
    if (!deleteModal.product) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteModal.product.id);
      showToast(`"${deleteModal.product.title}" deleted successfully`, 'success');
      closeDeleteModal();
    } catch (err) {
      showToast('Failed to delete product', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // calculate page numbers to display in pagination
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      if (page <= 3) end = 4;
      else if (page >= totalPages - 2) start = totalPages - 3;

      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }, [page, totalPages]);

  // animation variants for framer motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  // render loading skeleton placeholders
  const renderSkeletons = () => (
    <div className={styles.grid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <Skeleton width="100%" height="200px" />
          <div className={styles.skeletonContent}>
            <Skeleton width="40%" height="20px" />
            <Skeleton width="90%" height="16px" />
            <Skeleton width="60%" height="24px" />
          </div>
        </div>
      ))}
    </div>
  );
  const capitalize = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className={styles.products}>
      {/*state bar*/}
      <div className={styles.statsBar}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className={`${styles.statItem} ${stat.filterKey && stockFilter === stat.filterKey ? styles.statItemActive : ''}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => stat.filterKey && filterByStock(stat.filterKey)}
            data-clickable={stat.filterKey ? 'true' : 'false'}
          >
            <div
              className={styles.statIcon}
              style={{ backgroundColor: stat.bgColor }}
            >
              <stat.icon size={18} color={stat.color} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </div>
      {/* page header with title and actions */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            <Sparkles size={24} className={styles.titleIcon} />
            Products
          </h1>
        </div>

        <div className={styles.actions}>
          {/* search input */}
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={styles.searchInput}
            />
            {searchInput && (
              <button
                className={styles.clearSearch}
                onClick={handleClearSearch}
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <ViewToggle view={view} onViewChange={handleViewChange} />
          <Button variant="primary" onClick={() => navigate('/products/new')}>
            <Plus size={18} />
            Add Product
          </Button>
        </div>
      </div>

      {/* category filter dropdown */}
      <div className={styles.categoryFilter}>
        <label className={styles.filterLabel}>Filter by Category</label>
        <select
          className={styles.categorySelect}
          value={category}
          onChange={(e) => handleCategoryClick(e.target.value)}
        >
          <option value="all">All Products</option>
          {categories.filter(cat => cat).map((cat) => (
            <option key={cat} value={cat}>
              {capitalize(String(cat).replace(/-/g, ' '))}
            </option>
          ))}
        </select>
      </div>

      {/* active filters indicator */}
      {(isSearching || category !== 'all' || stockFilter) && (
        <motion.div
          className={styles.searchStatus}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          {stockFilter ? (
            <>
              Showing <strong>{stats.find(s => s.filterKey === stockFilter)?.label || stockFilter}</strong> products ({total} found)
            </>
          ) : category !== 'all' ? (
            <>
              Showing <strong>{capitalize(String(category || '').replace(/-/g, ' '))}</strong> products ({total} found)
            </>
          ) : (
            <>
              Results for "<strong>{searchQuery}</strong>" ({total} found)
            </>
          )}
          <button onClick={handleClearSearch} className={styles.clearSearchLink}>
            Clear filters
          </button>
        </motion.div>
      )}
      {/* error state */}
      {error && (
        <motion.div
          className={styles.error}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <XCircle size={48} />
          <p>Error loading products: {error}</p>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </motion.div>
      )}
      {/* loading state */}
      {loading && renderSkeletons()}

      {/* empty state when no products found */}
      {!loading && !error && products.length === 0 && (
        <motion.div
          className={styles.emptyState}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img
            src={noDataIllustration}
            alt="No products found"
            className={styles.emptyIllustration}
          />
          <h3>{isSearching ? 'No products found' : 'No products yet'}</h3>
          <p>
            {isSearching
              ? `No products match your search. Try different keywords.`
              : 'Get started by adding your first product.'}
          </p>
          {isSearching ? (
            <Button variant="secondary" onClick={handleClearSearch}>
              Clear Search
            </Button>
          ) : (
            <Button variant="primary" onClick={() => navigate('/products/new')}>
              <Plus size={18} />
              Add Product
            </Button>
          )}
        </motion.div>
      )}

      {/* product grid view with animation */}
      <AnimatePresence mode="wait">
        {!loading && !error && products.length > 0 && view === 'grid' && (
          <motion.div
            key="grid"
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} onDelete={handleDeleteClick} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* product table view with animation */}
        {!loading && !error && products.length > 0 && view === 'table' && (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProductTable products={products} onDelete={handleDeleteClick} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* pagination controls */}
      {!loading && !error && totalPages > 1 && (
        <motion.div
          className={styles.pagination}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className={styles.pageInfo}>
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </span>

          <div className={styles.pageButtons}>
            <button
              className={styles.pageBtn}
              onClick={() => goToPage(page - 1)}
              disabled={!hasPrevPage}
            >
              <ChevronLeft size={18} />
            </button>

            {pageNumbers.map((pageNum, index) =>
              pageNum === '...' ? (
                <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                  ...
                </span>
              ) : (
                <button
                  key={pageNum}
                  className={`${styles.pageBtn} ${page === pageNum ? styles.activePage : ''}`}
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </button>
              )
            )}
            <button
              className={styles.pageBtn}
              onClick={() => goToPage(page + 1)}
              disabled={!hasNextPage}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      )}
      {/* delete confirmation modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={closeDeleteModal}
        title="Delete Product?"
      >
        <div className={styles.deleteModalContent}>
          <p>
            Are you sure you want to delete{' '}
            <strong>"{deleteModal.product?.title}"</strong>? This action cannot
            be undone.
          </p>
          <div className={styles.deleteModalActions}>
            <Button variant="secondary" onClick={closeDeleteModal}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              loading={deleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default Products;
