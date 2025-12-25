import { useNavigate } from 'react-router-dom';
import Badge from '../common/Badge';
import styles from './OrderTable.module.css';

function OrderTable({ orders }) {
  const navigate = useNavigate();

  // format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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

  const handleRowClick = (id) => {
    navigate(`/orders/${id}`);
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thOrderNumber}>Order Number</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Items</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              onClick={() => handleRowClick(order.id)}
              className={styles.row}
            >
              <td>
                <span className={styles.orderNumber}>{order.order_number}</span>
              </td>
              <td>
                <div className={styles.customerInfo}>
                  <span className={styles.customerName}>{order.customer_name}</span>
                  <span className={styles.customerEmail}>{order.customer_email}</span>
                </div>
              </td>
              <td>
                <span className={styles.date}>{formatDate(order.created_at)}</span>
              </td>
              <td>
                <span className={styles.itemsCount}>
                  {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                </span>
              </td>
              <td>
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status}
                </Badge>
              </td>
              <td>
                <Badge variant={getPaymentStatusVariant(order.payment_status)}>
                  {order.payment_status}
                </Badge>
              </td>
              <td>
                <span className={styles.total}>{formatPrice(order.total)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;

