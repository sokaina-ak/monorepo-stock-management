import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CategoryForm from '../components/categories/CategoryForm';
import Skeleton from '../components/common/Skeleton';
import { useToast } from '../context/ToastContext';
import categoryService from '../services/categoryService';
import styles from './EditCategory.module.css';

function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await categoryService.getCategory(id);
        setCategory(data);
      } catch (err) {
        console.error('Failed to fetch category:', err);
        setError(err.response?.status === 404
          ? 'Category not found'
          : 'Failed to load category');
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      const result = await categoryService.updateCategory(id, formData);
      showToast(`Category "${result.name}" updated successfully!`, 'success');
      navigate(`/categories/${id}`);
    } catch (err) {
      console.error('Failed to update category:', err);
      const message = err.response?.data?.message || 'Failed to update category. Please try again.';
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/categories/${id}`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Skeleton width="100%" height="400px" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <Link to="/categories" className={styles.backLink}>
            <ArrowLeft size={18} />
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link to={`/categories/${id}`} className={styles.backLink}>
        <ArrowLeft size={18} />
        Back to Category
      </Link>
      <div className={styles.header}>
        <h1 className={styles.title}>Edit Category</h1>
        <p className={styles.subtitle}>
          Update the category details below
        </p>
      </div>
      <CategoryForm
        initialData={category}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={submitting}
        submitLabel="Update Category"
      />
    </div>
  );
}

export default EditCategory;

