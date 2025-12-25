import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Tag,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Sparkles,
  FolderTree,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import categoryService from '../services/categoryService';
import noDataIllustration from '../assets/images/undraw_no-data_ig65.svg';
import Button from '../components/common/Button';
import Skeleton from '../components/common/Skeleton';
import Modal from '../components/common/Modal';
import CategoryCard from '../components/categories/CategoryCard';
import CategoryTable from '../components/categories/CategoryTable';
import ViewToggle from '../components/products/ViewToggle';
import styles from './Categories.module.css';

function Categories() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState(() => {
    return localStorage.getItem('categoriesView') || 'grid';
  });
  const [searchInput, setSearchInput] = useState('');
  const [typeFilter, setTypeFilter] = useState(null); // null, 'main', 'sub'
  const [deleteModal, setDeleteModal] = useState({ open: false, category: null });
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await categoryService.getCategories();
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError(err.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // filter categories based on search and type filter
  const filteredCategories = useMemo(() => {
    let filtered = categories;
    
    // apply type filter (main categories or subcategories)
    if (typeFilter === 'main') {
      filtered = filtered.filter(c => !c.parent_id);
    } else if (typeFilter === 'sub') {
      filtered = filtered.filter(c => c.parent_id);
    }
    
    // apply search filter
    if (searchInput.trim()) {
      const query = searchInput.toLowerCase();
      filtered = filtered.filter(cat => 
        cat.name?.toLowerCase().includes(query) ||
        cat.slug?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [categories, searchInput, typeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / limit);
  const paginatedCategories = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredCategories.slice(start, start + limit);
  }, [filteredCategories, page, limit]);

  // stats configuration with filter keys
  const stats = [
    {
      label: 'Total Categories',
      value: categories.length,
      icon: Tag,
      color: 'var(--color-accent)',
      bgColor: 'var(--color-accent-light)',
      filterKey: null, // no filter for total
    },
    {
      label: 'Main Categories',
      value: categories.filter(c => !c.parent_id).length,
      icon: FolderTree,
      color: 'var(--color-success)',
      bgColor: 'var(--color-success-light)',
      filterKey: 'main',
    },
    {
      label: 'Subcategories',
      value: categories.filter(c => c.parent_id).length,
      icon: AlertTriangle,
      color: 'var(--color-warning)',
      bgColor: 'var(--color-warning-light)',
      filterKey: 'sub',
    },
  ];

  const handleViewChange = (newView) => {
    setView(newView);
    localStorage.setItem('categoriesView', newView);
  };

  // handle type filter click (toggle off if same filter clicked)
  const handleTypeFilter = (filterKey) => {
    setTypeFilter(filterKey === typeFilter ? null : filterKey);
    setSearchInput(''); // clear search when filtering
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setTypeFilter(null); // also clear type filter
    setPage(1);
  };

  const handleDeleteClick = (category) => {
    setDeleteModal({ open: true, category });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, category: null });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.category) return;
    setDeleting(true);
    try {
      await categoryService.deleteCategory(deleteModal.category.id);
      setCategories(prev => prev.filter(c => c.id !== deleteModal.category.id));
      showToast(`"${deleteModal.category.name}" deleted successfully`, 'success');
      closeDeleteModal();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete category';
      showToast(message, 'error');
    } finally {
      setDeleting(false);
    }
  };

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

  const renderSkeletons = () => (
    <div className={styles.grid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <Skeleton width="100%" height="200px" />
          <div className={styles.skeletonContent}>
            <Skeleton width="40%" height="20px" />
            <Skeleton width="90%" height="16px" />
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
    <div className={styles.categories}>
      {/* Stats bar */}
      <div className={styles.statsBar}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className={`${styles.statItem} ${stat.filterKey && typeFilter === stat.filterKey ? styles.statItemActive : ''}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => stat.filterKey && handleTypeFilter(stat.filterKey)}
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

      {/* Page header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            <Sparkles size={24} className={styles.titleIcon} />
            Categories
          </h1>
        </div>

        <div className={styles.actions}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search categories..."
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
          <Button variant="primary" onClick={() => navigate('/categories/new')}>
            <Plus size={18} />
            Add Category
          </Button>
        </div>
      </div>

      {/* active filters indicator */}
      {(searchInput || typeFilter) && (
        <motion.div
          className={styles.searchStatus}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          {searchInput && (
            <span>Results for "<strong>{searchInput}</strong>"</span>
          )}
          {typeFilter && (
            <span>Filter: <strong>{typeFilter === 'main' ? 'Main Categories' : 'Subcategories'}</strong></span>
          )}
          <span>({filteredCategories.length} found)</span>
          <button onClick={handleClearSearch} className={styles.clearSearchLink}>
            Clear {searchInput && typeFilter ? 'filters' : searchInput ? 'search' : 'filter'}
          </button>
        </motion.div>
      )}

      {/* Error state */}
      {error && (
        <motion.div
          className={styles.error}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <XCircle size={48} />
          <p>Error loading categories: {error}</p>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </motion.div>
      )}

      {/* Loading */}
      {loading && renderSkeletons()}

      {/* Empty state */}
      {!loading && !error && filteredCategories.length === 0 && (
        <motion.div
          className={styles.emptyState}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img
            src={noDataIllustration}
            alt="No categories found"
            className={styles.emptyIllustration}
          />
          <h3>{searchInput ? 'No categories found' : 'No categories yet'}</h3>
          <p>
            {searchInput
              ? `No categories match your search. Try different keywords.`
              : 'Get started by adding your first category.'}
          </p>
          {searchInput ? (
            <Button variant="secondary" onClick={handleClearSearch}>
              Clear Search
            </Button>
          ) : (
            <Button variant="primary" onClick={() => navigate('/categories/new')}>
              <Plus size={18} />
              Add Category
            </Button>
          )}
        </motion.div>
      )}

      {/* Category grid */}
      <AnimatePresence mode="wait">
        {!loading && !error && paginatedCategories.length > 0 && view === 'grid' && (
          <motion.div
            key="grid"
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            {paginatedCategories.map((category) => (
              <motion.div key={category.id} variants={itemVariants}>
                <CategoryCard category={category} onDelete={handleDeleteClick} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Category table */}
        {!loading && !error && paginatedCategories.length > 0 && view === 'table' && (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CategoryTable categories={paginatedCategories} onDelete={handleDeleteClick} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
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
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
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
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              )
            )}
            <button
              className={styles.pageBtn}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={closeDeleteModal}
        title="Delete Category?"
      >
        <div className={styles.deleteModalContent}>
          <p>
            Are you sure you want to delete{' '}
            <strong>"{deleteModal.category?.name}"</strong>? This action cannot
            be undone.
          </p>
          {deleteModal.category?.products_count > 0 && (
            <p className={styles.warning}>
              This category has {deleteModal.category.products_count} associated products.
            </p>
          )}
          {deleteModal.category?.children_count > 0 && (
            <p className={styles.warning}>
              This category has {deleteModal.category.children_count} subcategories.
            </p>
          )}
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

export default Categories;

