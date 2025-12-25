import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle, User, Mail, Phone, MapPin, CreditCard, Edit } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Skeleton from '../components/common/Skeleton';
import Modal from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import orderService from '../services/orderService';
import styles from './OrderDetail.module.css';

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // component state
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    payment_status: '',
    notes: '',
  });

  // fetch order data
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await orderService.getById(id);
        setOrder(data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError(err.response?.status === 404
          ? 'Order not found'
          : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // handle status update
  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const data = await orderService.update(id, updateData);
      setOrder(data);
      showToast('Order updated successfully', 'success');
      setUpdateModalOpen(false);
      setUpdateData({ status: '', payment_status: '', notes: '' });
    } catch (err) {
      console.error('Failed to update order:', err);
      showToast('Failed to update order', 'error');
    } finally {
      setUpdating(false);
    }
  };

  // open update modal
  const openUpdateModal = () => {
    setUpdateData({
      status: order.status || '',
      payment_status: order.payment_status || '',
      notes: order.notes || '',
    });
    setUpdateModalOpen(true);
  };

  // format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // format currency
  const formatPrice = (price) => `$${parseFloat(price || 0).toFixed(2)}`;

  // get status badge variant
  const getStatusVariant = (status) => {
    const variants = {
      pending: 'warning',
      processing: 'info',
      shipped: 'info',
      delivered: 'success',
      cancelled: 'error',
    };
    return variants[status] || 'default';
  };

  // get payment status badge variant
  const getPaymentStatusVariant = (status) => {
    const variants = {
      pending: 'warning',
      paid: 'success',
      failed: 'error',
      refunded: 'error',
    };
    return variants[status] || 'default';
  };

  // loading skeleton
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.backLink}>
          <Skeleton width="150px" height="20px" />
        </div>
        <div className={styles.content}>
          <div className={styles.mainSection}>
            <Skeleton width="60%" height="32px" />
            <Skeleton width="100%" height="200px" />
          </div>
          <div className={styles.sidebar}>
            <Skeleton width="100%" height="150px" />
          </div>
        </div>
      </div>
    );
  }

  // error state
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <Package size={64} className={styles.errorIcon} />
          <h2>{error}</h2>
          <p>The order you're looking for might have been removed or doesn't exist.</p>
          <Button onClick={() => navigate('/orders')}>
            <ArrowLeft size={18} />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link to="/orders" className={styles.backLink}>
        <ArrowLeft size={18} />
        Back to Orders
      </Link>

      <div className={styles.content}>
        {/* main section */}
        <div className={styles.mainSection}>
          {/* order header */}
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <h1 className={styles.title}>Order {order.order_number}</h1>
              <span className={styles.orderDate}>Placed on {formatDate(order.created_at)}</span>
            </div>
            <div className={styles.headerActions}>
              <Button variant="secondary" onClick={openUpdateModal}>
                <Edit size={18} />
                Update Order
              </Button>
            </div>
          </div>

          {/* status badges */}
          <div className={styles.statusSection}>
            <div className={styles.statusBadge}>
              <Badge variant={getStatusVariant(order.status)}>
                {order.status}
              </Badge>
              <span className={styles.statusLabel}>Order Status</span>
            </div>
            <div className={styles.statusBadge}>
              <Badge variant={getPaymentStatusVariant(order.payment_status)}>
                {order.payment_status}
              </Badge>
              <span className={styles.statusLabel}>Payment Status</span>
            </div>
          </div>

          {/* order items */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Order Items</h2>
            <div className={styles.itemsList}>
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div key={item.id} className={styles.itemCard}>
                    {item.product?.thumbnail && (
                      <img
                        src={item.product.thumbnail}
                        alt={item.product_title}
                        className={styles.itemImage}
                      />
                    )}
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemTitle}>{item.product_title}</h3>
                      <div className={styles.itemDetails}>
                        <span className={styles.itemQuantity}>Quantity: {item.quantity}</span>
                        <span className={styles.itemPrice}>Price: {formatPrice(item.product_price)}</span>
                      </div>
                    </div>
                    <div className={styles.itemSubtotal}>
                      {formatPrice(item.subtotal)}
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.noItems}>No items in this order</p>
              )}
            </div>
          </div>

          {/* customer information */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Customer Information</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <User size={18} />
                <span className={styles.infoLabel}>Name</span>
                <span className={styles.infoValue}>{order.customer_name}</span>
              </div>
              <div className={styles.infoItem}>
                <Mail size={18} />
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{order.customer_email}</span>
              </div>
              {order.customer_phone && (
                <div className={styles.infoItem}>
                  <Phone size={18} />
                  <span className={styles.infoLabel}>Phone</span>
                  <span className={styles.infoValue}>{order.customer_phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* shipping address */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Shipping Address</h2>
            <div className={styles.addressBox}>
              <MapPin size={18} />
              <p>{order.shipping_address}</p>
            </div>
          </div>

          {/* notes */}
          {order.notes && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Notes</h2>
              <div className={styles.notesBox}>
                <p>{order.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* sidebar */}
        <div className={styles.sidebar}>
          {/* order summary */}
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>Order Summary</h3>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Tax</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>{formatPrice(order.shipping_cost)}</span>
            </div>
            {order.discount > 0 && (
              <div className={styles.summaryRow}>
                <span>Discount</span>
                <span className={styles.discount}>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* payment information */}
          <div className={styles.infoCard}>
            <h3 className={styles.infoCardTitle}>Payment Information</h3>
            <div className={styles.infoRow}>
              <span className={styles.infoRowLabel}>Method</span>
              <span className={styles.infoRowValue}>
                {order.payment_method ? order.payment_method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoRowLabel}>Status</span>
              <span className={styles.infoRowValue}>
                <Badge variant={getPaymentStatusVariant(order.payment_status)}>
                  {order.payment_status}
                </Badge>
              </span>
            </div>
          </div>

          {/* shipping information */}
          {order.shipped_at && (
            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Shipping Information</h3>
              {order.shipped_at && (
                <div className={styles.infoRow}>
                  <span className={styles.infoRowLabel}>Shipped on</span>
                  <span className={styles.infoRowValue}>{formatDate(order.shipped_at)}</span>
                </div>
              )}
              {order.delivered_at && (
                <div className={styles.infoRow}>
                  <span className={styles.infoRowLabel}>Delivered on</span>
                  <span className={styles.infoRowValue}>{formatDate(order.delivered_at)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* update order modal */}
      <Modal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        title="Update Order"
      >
        <div className={styles.updateModalContent}>
          <div className={styles.formGroup}>
            <label htmlFor="status">Order Status</label>
            <select
              id="status"
              value={updateData.status}
              onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
              className={styles.selectInput}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="payment_status">Payment Status</label>
            <select
              id="payment_status"
              value={updateData.payment_status}
              onChange={(e) => setUpdateData({ ...updateData, payment_status: e.target.value })}
              className={styles.selectInput}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={updateData.notes}
              onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
              className={styles.textareaInput}
              rows={4}
              placeholder="Add any notes about this order..."
            />
          </div>
          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={() => setUpdateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdate} loading={updating}>
              Update Order
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default OrderDetail;

