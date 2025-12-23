import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CategoryForm from '../components/categories/CategoryForm';
import { useToast } from '../context/ToastContext';
import categoryService from '../services/categoryService';
import styles from './AddCategory.module.css';

function AddCategory() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const result = await categoryService.createCategory(formData);
      showToast(`Category "${result.name}" created successfully!`, 'success');
      navigate('/categories');
    } catch (error) {
      console.error('Failed to create category:', error);
      const message = error.response?.data?.message || 'Failed to create category. Please try again.';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/categories');
  };

  return (
    <div className={styles.container}>
      <Link to="/categories" className={styles.backLink}>
        <ArrowLeft size={18} />
        Back to Categories
      </Link>
      <div className={styles.header}>
        <h1 className={styles.title}>Add New Category</h1>
        <p className={styles.subtitle}>
          Fill in the details below to create a new category
        </p>
      </div>
      <CategoryForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        submitLabel="Create Category"
      />
    </div>
  );
}

export default AddCategory;

