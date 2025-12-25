import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import orderService from '../services/orderService';
import noDataIllustration from '../assets/images/undraw_no-data_ig65.svg';
import Button from '../components/common/Button';
import Skeleton from '../components/common/Skeleton';
import Modal from '../components/common/Modal';
import ViewToggle from '../components/products/ViewToggle';
import OrderTable from '../components/orders/OrderTable';
import styles from './Orders.module.css';

function Orders() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // component state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState(() => {
    return localStorage.getItem('ordersView') || 'grid';
  });
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);

  // fetch all orders (for stats and filtering)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        // always fetch all orders (no status filter) so stats are accurate
        const data = await orderService.getAll(10000, 0, null);
        setOrders(data.orders || []);
        setTotal(data.orders?.length || 0);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError(err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // filter orders by status and search
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // apply status filter
    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // apply search filter
    if (searchInput.trim()) {
      const query = searchInput.toLowerCase();
      filtered = filtered.filter(order => 
        order.order_number?.toLowerCase().includes(query) ||
        order.customer_name?.toLowerCase().includes(query) ||
        order.customer_email?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [orders, statusFilter, searchInput]);

  // pagination
  const totalPages = Math.ceil(filteredOrders.length / limit);
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredOrders.slice(start, start + limit);
  }, [filteredOrders, page, limit]);

  // stats configuration - always calculated from all orders (memoized)
  const stats = useMemo(() => [
    {
      label: 'Total Orders',
      value: orders.length,
      icon: ShoppingCart,
      color: 'var(--color-accent)',
      bgColor: 'var(--color-accent-light)',
      filterKey: null,
    },
    {
      label: 'Pending',
      value: orders.filter(o => o.status === 'pending').length,
      icon: Clock,
      color: 'var(--color-warning)',
      bgColor: 'var(--color-warning-light)',
      filterKey: 'pending',
    },
    {
      label: 'Processing',
      value: orders.filter(o => o.status === 'processing').length,
      icon: Package,
      color: 'var(--color-info)',
      bgColor: '#DBEAFE',
      filterKey: 'processing',
    },
    {
      label: 'Shipped',
      value: orders.filter(o => o.status === 'shipped').length,
      icon: Truck,
      color: '#3B82F6',
      bgColor: '#DBEAFE',
      filterKey: 'shipped',
    },
    {
      label: 'Delivered',
      value: orders.filter(o => o.status === 'delivered').length,
      icon: CheckCircle,
      color: 'var(--color-success)',
      bgColor: 'var(--color-success-light)',
      filterKey: 'delivered',
    },
    {
      label: 'Cancelled',
      value: orders.filter(o => o.status === 'cancelled').length,
      icon: XCircle,
      color: 'var(--color-error)',
      bgColor: 'var(--color-error-light)',
      filterKey: 'cancelled',
    },
  ], [orders]);

  // save view preference to local storage
  const handleViewChange = (newView) => {
    setView(newView);
    localStorage.setItem('ordersView', newView);
  };

  // handle status filter click
  const handleStatusFilter = (filterKey) => {
    setStatusFilter(filterKey === statusFilter ? null : filterKey);
    setSearchInput('');
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setStatusFilter(null);
    setPage(1);
  };

  // format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // format currency
  const formatPrice = (price) => `$${parseFloat(price || 0).toFixed(2)}`;

  // capitalize helper
  const capitalize = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // get status badge color
  const getStatusColor = (status) => {
    const colors = {
      pending: 'var(--color-warning)',
      processing: '#3B82F6',
      shipped: '#3B82F6',
      delivered: 'var(--color-success)',
      cancelled: 'var(--color-error)',
    };
    return colors[status] || 'var(--color-text-secondary)';
  };

  // calculate page numbers
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

  // render loading skeletons
  const renderSkeletons = () => (
    <div className={styles.ordersList}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.orderCard}>
          <Skeleton width="100%" height="120px" />
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.orders}>
      {/* stats bar */}
      <div className={styles.statsBar}>
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
          <motion.div
            key={stat.label}
            className={`${styles.statItem} ${stat.filterKey && statusFilter === stat.filterKey ? styles.statItemActive : ''}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => stat.filterKey && handleStatusFilter(stat.filterKey)}
            data-clickable={stat.filterKey ? 'true' : 'false'}
          >
            <div
              className={styles.statIcon}
              style={{ backgroundColor: stat.bgColor }}
            >
              {IconComponent && <IconComponent size={18} color={stat.color} />}
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </motion.div>
          );
        })}
      </div>

      {/* page header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            <Sparkles size={24} className={styles.titleIcon} />
            Orders
          </h1>
        </div>

        <div className={styles.actions}>
          {/* search input */}
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by order number, name, or email..."
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
        </div>
      </div>

      {/* active filters indicator */}
      {(searchInput || statusFilter) && (
        <motion.div
          className={styles.searchStatus}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          {statusFilter ? (
            <>
              Showing <strong>{stats.find(s => s.filterKey === statusFilter)?.label || capitalize(statusFilter)}</strong> orders ({filteredOrders.length} found)
            </>
          ) : (
            <>
              Results for "<strong>{searchInput}</strong>" ({filteredOrders.length} found)
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
          <p>Error loading orders: {error}</p>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </motion.div>
      )}

      {/* loading state */}
      {loading && renderSkeletons()}

      {/* empty state */}
      {!loading && !error && filteredOrders.length === 0 && (
        <motion.div
          className={styles.emptyState}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img
            src={noDataIllustration}
            alt="No orders found"
            className={styles.emptyIllustration}
          />
          <h3>{searchInput || statusFilter ? 'No orders found' : 'No orders yet'}</h3>
          <p>
            {searchInput || statusFilter
              ? `No orders match your search or filter. Try different criteria.`
              : 'Orders will appear here once customers place orders.'}
          </p>
          {(searchInput || statusFilter) && (
            <Button variant="secondary" onClick={handleClearSearch}>
              Clear Search
            </Button>
          )}
        </motion.div>
      )}

      {/* orders list - grid view */}
      {!loading && !error && paginatedOrders.length > 0 && view === 'grid' && (
        <div className={styles.ordersList}>
          {paginatedOrders.map((order) => (
            <motion.div
              key={order.id}
              className={styles.orderCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <div className={styles.orderHeader}>
                <div className={styles.orderInfo}>
                  <h3 className={styles.orderNumber}>{order.order_number}</h3>
                  <span className={styles.orderDate}>{formatDate(order.created_at)}</span>
                </div>
                <div
                  className={styles.statusBadge}
                  style={{ 
                    backgroundColor: `${getStatusColor(order.status)}20`,
                    color: getStatusColor(order.status),
                  }}
                >
                  {order.status}
                </div>
              </div>
              
              <div className={styles.orderDetails}>
                <div className={styles.customerInfo}>
                  <span className={styles.customerName}>{order.customer_name}</span>
                  <span className={styles.customerEmail}>{order.customer_email}</span>
                </div>
                <div className={styles.orderStats}>
                  <span className={styles.itemsCount}>
                    {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                  </span>
                  <span className={styles.orderTotal}>{formatPrice(order.total)}</span>
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className={styles.orderItems}>
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={item.id || index} className={styles.orderItem}>
                      {item.product?.thumbnail && (
                        <img 
                          src={item.product.thumbnail} 
                          alt={item.product_title}
                          className={styles.itemThumbnail}
                        />
                      )}
                      <span className={styles.itemName}>{item.product_title}</span>
                      <span className={styles.itemQuantity}>x{item.quantity}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <span className={styles.moreItems}>+{order.items.length - 3} more</span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* orders table view */}
      {!loading && !error && paginatedOrders.length > 0 && view === 'table' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <OrderTable orders={paginatedOrders} />
        </motion.div>
      )}

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
    </div>
  );
}

export default Orders;

