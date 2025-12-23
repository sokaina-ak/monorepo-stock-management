import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '../components/products/ProductForm';
import Skeleton from '../components/common/Skeleton';
import { useToast } from '../context/ToastContext';
import productService from '../services/productService';
import styles from './EditProduct.module.css';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
//all states
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch product data
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

  //form submission
  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      // simulated
      const result = await productService.update(id, formData);
      showToast(`Product "${result.title}" updated successfully!`, 'success');
      navigate(`/products/${id}`);
    } catch (err) {
      console.error('Failed to update product:', err);
      showToast('Failed to update product. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  //if cancel go back to product detail
  const handleCancel = () => {
    navigate(`/products/${id}`);
  };
  //loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <Skeleton width="150px" height="20px" />
        <div className={styles.header}>
          <Skeleton width="200px" height="32px" />
          <Skeleton width="300px" height="20px" />
        </div>
        <div className={styles.formSkeleton}>
          <Skeleton width="100%" height="400px" />
        </div>
      </div>
    );
  }
  //error state varify but work on real api if i make backend for it
  if (error) {
    return (
      <div className={styles.container}>
        <Link to="/products" className={styles.backLink}>
          <ArrowLeft size={18} />
          Back to Products
        </Link>
        <div className={styles.errorState}>
          <h2>{error}</h2>
          <p>The product you're trying to edit might have been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link to={`/products/${id}`} className={styles.backLink}>
        <ArrowLeft size={18} />
        Back to Product
      </Link>
      <div className={styles.header}>
        <h1 className={styles.title}>Edit Product</h1>
        <p className={styles.subtitle}>
          Update the details for <strong>{product.title}</strong>
        </p>
      </div>
      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={submitting}
        submitLabel="Save Changes"
      />
    </div>
  );
}
export default EditProduct;
