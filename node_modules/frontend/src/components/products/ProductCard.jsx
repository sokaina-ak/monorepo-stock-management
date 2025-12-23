import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Eye, Star } from 'lucide-react';

import Badge from '../common/Badge';
import styles from './ProductCard.module.css';


function ProductCard({ product, onDelete }) {
  const navigate = useNavigate();

  //stock status badge of the product
  const getStockBadge = (stock) => {
    if (stock === 0) return { variant: 'error', label: 'Out of Stock' };
    if (stock <= 10) return { variant: 'warning', label: 'Low Stock' };
    return { variant: 'success', label: 'In Stock' };
  };
  const stockBadge = getStockBadge(product.stock || 0);

  //if discount exists will calc origin price
  const discountPercentage = Number(product.discountPercentage) || 0;
  const price = Number(product.price) || 0;
  const originalPrice = discountPercentage > 0 ? price / (1 - (discountPercentage/100)) : null;
  
  // Safe rating value - ensure it's a number (handle string, null, undefined)
  const rating = typeof product.rating === 'number' ? product.rating : (parseFloat(product.rating) || 0);

  // price $
  const formatPrice = (price) => {
    const numPrice = Number(price) || 0;
    return `$${numPrice.toFixed(2)}`;
  };

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/products/${product.id}/edit`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(product);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    navigate(`/products/${product.id}`);
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      
      {/*img*/}
      <div className={styles.imageWrapper}>
        <img
          src={product.thumbnail}
          alt={product.title}
          className={styles.image}
        />
        {/*if discount && mean return*/}
        {discountPercentage > 10 && (
          <span className={styles.discountBadge}>
            -{Math.round(discountPercentage)}%
          </span>
        )}
        {/*stock badge */}
        <div className={styles.stockBadge}>
          <Badge variant={stockBadge.variant}>{stockBadge.label}</Badge>
        </div>

        <div className={styles.overlay} />{/*shadow nor hov and actions*/}
        <div className={styles.quickActions}>
          <button
            className={styles.quickBtn}
            onClick={handleQuickView}
            title="Quick View"
          >
            <Eye size={18} />
          </button>
          <button
            className={styles.quickBtn}
            onClick={handleEdit}
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            className={`${styles.quickBtn} ${styles.quickBtnDanger}`}
            onClick={handleDelete}
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>

      </div>

      {/*info*/}
      <div className={styles.content}>
        <span className={styles.category}>{product.category || 'Uncategorized'}</span>
        <h3 className={styles.title}>{product.title || 'Untitled Product'}</h3>
        <p className={styles.brand}>{product.brand || 'No Brand'}</p>
        <div className={styles.rating}>
          <div className={styles.stars}>
            {/*empty array with 5*/}
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i<Math.floor(rating)? styles.starFilled : styles.starEmpty}
              />
            ))}
          </div>
          <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
          <span className={styles.ratingCount}>({product.stock || 0} left)</span>
        </div>
        {/*price section*/}
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(price)}</span>
          {originalPrice && (<span className={styles.originalPrice}>{formatPrice(originalPrice)}</span>)}
        </div>
      </div>

    </div>
  );
}
export default ProductCard;
