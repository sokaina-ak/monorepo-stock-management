import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Star, Package, Tag, Building2, BarChart3 } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Skeleton from '../components/common/Skeleton';
import Modal from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import productService from '../services/productService';
import styles from './ProductDetail.module.css';


function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  // component state
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getById(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError(err.response?.status === 404
          ? 'Product not found'
          : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // handle product deletion
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await productService.delete(id);
      showToast('Product deleted successfully', 'success');
      navigate('/products');
    } catch (err) {
      console.error('Failed to delete product:', err);
      showToast('Failed to delete product', 'error');
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };
  // get stock status badge configuration
  const getStockBadge = (stock) => {
    if (stock === 0) return { variant: 'error', text: 'Out of Stock' };
    if (stock < 10) return { variant: 'warning', text: 'Low Stock' };
    return { variant: 'success', text: 'In Stock' };
  };
  // format price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  const getDiscountedPrice = (price, discount) => {
    return price - (price * discount / 100);
  };
  // render star rating display
  const renderStars = (rating) => {
    const numRating = Number(rating) || 0;
    const stars = [];
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} size={18} className={styles.starFilled} fill="currentColor" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} size={18} className={styles.starHalf} />
        );
      } else {
        stars.push(
          <Star key={i} size={18} className={styles.starEmpty} />
        );
      }
    }
    return stars;
  };

  // loading skeleton state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.backLink}>
          <Skeleton width="150px" height="20px" />
        </div>
        <div className={styles.content}>
          <div className={styles.imageSection}>
            <Skeleton width="100%" height="400px" />
            <div className={styles.thumbnails}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} width="80px" height="80px" />
              ))}
            </div>
          </div>
          <div className={styles.infoSection}>
            <Skeleton width="60%" height="32px" />
            <Skeleton width="40%" height="24px" />
            <Skeleton width="100%" height="100px" />
            <Skeleton width="30%" height="40px" />
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
          <p>The product you're looking for might have been removed or doesn't exist.</p>
          <Button onClick={() => navigate('/products')}>
            <ArrowLeft size={18} />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }
  const stockBadge = getStockBadge(product.stock);
  const discountedPrice = product.discountPercentage? getDiscountedPrice(product.price, product.discountPercentage): null;

  return (
    <div className={styles.container}>
      <Link to="/products" className={styles.backLink}>
        <ArrowLeft size={18} />
        Back to Products
      </Link>

      <div className={styles.content}>
        {/* image gallery */}
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            <img
              src={product.images?.[selectedImage] || product.thumbnail}
              alt={product.title}
            />
            {product.discountPercentage > 0 && (
              <span className={styles.discountTag}>
                -{Math.round(product.discountPercentage)}%
              </span>
            )}
          </div>

          {/* thumbnail gallery */}
          {product.images && product.images.length > 1 && (
            <div className={styles.thumbnails}>
              {product.images.map((img, index) => (
                <button
                  key={index}
                  className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt={`${product.title} ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* product information */}
        <div className={styles.infoSection}>
          <div className={styles.header}>
            <div className={styles.categoryRow}>
              <Badge variant="default">{product.category}</Badge>
              <Badge variant={stockBadge.variant}>{stockBadge.text}</Badge>
            </div>
            <h1 className={styles.title}>{product.title}</h1>
            <div className={styles.rating}>
              <div className={styles.stars}>
                {renderStars(Number(product.rating) || 0)}
              </div>
              <span className={styles.ratingValue}>{(Number(product.rating) || 0).toFixed(1)}</span>
              <span className={styles.reviews}>({product.reviews?.length || 0} reviews)</span>
            </div>
          </div>
          <div className={styles.priceSection}>
            {discountedPrice ? (
              <>
                <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
                <span className={styles.currentPrice}>{formatPrice(discountedPrice)}</span>
              </>
            ) : (
              <span className={styles.currentPrice}>{formatPrice(product.price)}</span>
            )}
          </div>
          <div className={styles.description}>
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          <div className={styles.details}>
            <h3>Product Details</h3>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <Building2 size={18} />
                <span className={styles.detailLabel}>Brand</span>
                <span className={styles.detailValue}>{product.brand || 'N/A'}</span>
              </div>
              <div className={styles.detailItem}>
                <Tag size={18} />
                <span className={styles.detailLabel}>SKU</span>
                <span className={styles.detailValue}>{product.sku || `SKU-${product.id}`}</span>
              </div>
              <div className={styles.detailItem}>
                <Package size={18} />
                <span className={styles.detailLabel}>Stock</span>
                <span className={styles.detailValue}>{product.stock} units</span>
              </div>
              <div className={styles.detailItem}>
                <BarChart3 size={18} />
                <span className={styles.detailLabel}>Min. Order</span>
                <span className={styles.detailValue}>{product.minimumOrderQuantity || 1} unit</span>
              </div>
            </div>
          </div>
          {(product.warrantyInformation || product.shippingInformation) && (
            <div className={styles.additionalInfo}>
              {product.warrantyInformation && (
                <div className={styles.infoChip}>
                  <span>Warranty:</span> {product.warrantyInformation}
                </div>
              )}
              {product.shippingInformation && (
                <div className={styles.infoChip}>
                  <span>Shipping:</span> {product.shippingInformation}
                </div>
              )}
            </div>
          )}

          <div className={styles.actions}>
            <Button
              variant="primary"
              onClick={() => navigate(`/products/${id}/edit`)}
            >
              <Edit size={18} />
              Edit Product
            </Button>
            <Button
              variant="danger"
              onClick={() => setDeleteModalOpen(true)}
            >
              <Trash2 size={18} />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* customer reviews section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className={styles.reviewsSection}>
          <h2>Customer Reviews</h2>
          <div className={styles.reviewsList}>
            {product.reviews.map((review, index) => (
              <div key={index} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewerInfo}>
                    <span className={styles.reviewerName}>{review.reviewerName}</span>
                    <span className={styles.reviewDate}>
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={styles.reviewRating}>
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className={styles.reviewComment}>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* delete confirmation modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Product?"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={deleting}
            >
              Delete
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete <strong>"{product?.title}"</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
export default ProductDetail;
