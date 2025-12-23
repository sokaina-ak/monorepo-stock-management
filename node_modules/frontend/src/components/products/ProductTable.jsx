import { useNavigate } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import Badge from '../common/Badge';
import styles from './ProductTable.module.css';

function ProductTable({ products, onDelete }) {
  const navigate = useNavigate();

  const getStockBadge = (stock) => {
    if (stock === 0) return { variant: 'error', label: 'Out of Stock' };
    if (stock <= 10) return { variant: 'warning', label: 'Low Stock' };
    return { variant: 'success', label: 'In Stock' };
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };
  const handleRowClick = (id) => {
    navigate(`/products/${id}`);
  };
  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/products/${id}/edit`);
  };
  const handleDelete = (e, product) => {
    e.stopPropagation();
    onDelete(product);
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thImage}>Image</th>
            <th className={styles.thTitle}>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Rating</th>
            <th className={styles.thActions}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const stockBadge = getStockBadge(product.stock || 0);
            const rating = typeof product.rating === 'number' ? product.rating : (parseFloat(product.rating) || 0);
            const price = Number(product.price) || 0;
            return (
              <tr
                key={product.id}
                onClick={() => handleRowClick(product.id)}
                className={styles.row}
              >
                <td>
                  <img
                    src={product.thumbnail || ''}
                    alt={product.title || 'Product'}
                    className={styles.thumbnail}
                  />
                </td>
                <td>
                  <div className={styles.productInfo}>
                    <span className={styles.productTitle}>{product.title || 'Untitled Product'}</span>
                    <span className={styles.productBrand}>
                      {product.brand || 'No Brand'}
                    </span>
                  </div>
                </td>
                <td>
                  <Badge variant="default">{product.category || 'Uncategorized'}</Badge>
                </td>
                <td>
                  <span className={styles.price}>{formatPrice(price)}</span>
                </td>
                <td>
                  <Badge variant={stockBadge.variant}>{stockBadge.label}</Badge>
                </td>
                <td>
                  <div className={styles.rating}>
                    <span className={styles.ratingStar}>★</span>
                    <span>{rating.toFixed(1)}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.actionBtn}
                      onClick={(e) => handleEdit(e, product.id)}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={(e) => handleDelete(e, product)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
