import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import ProductForm from '../components/products/ProductForm';
import { useToast } from '../context/ToastContext';
import productService from '../services/productService';

import styles from './AddProduct.module.css';


function AddProduct() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  //form submission
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      // POST but it is simulated
      const result = await productService.create(formData);
      showToast(`Product "${result.title}" created successfully!`, 'success');
      navigate('/products');
    } catch (error) {
      console.error('Failed to create product:', error);
      showToast('Failed to create product. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  //in cancel will go back to products
  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <div className={styles.container}>

      <Link to="/products" className={styles.backLink}>
        <ArrowLeft size={18} />
        Back to Products
      </Link>
      <div className={styles.header}>
        <h1 className={styles.title}>Add New Product</h1>
        <p className={styles.subtitle}>
          Fill in the details below to create a new product
        </p>
      </div>
      <ProductForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        submitLabel="Create Product"
      />
    </div>
  );
}
export default AddProduct;
