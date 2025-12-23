import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Tag, FolderTree, Package } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Skeleton from '../components/common/Skeleton';
import Modal from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import categoryService from '../services/categoryService';
import styles from './CategoryDetail.module.css';

function CategoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await categoryService.deleteCategory(id);
      showToast('Category deleted successfully', 'success');
      navigate('/categories');
    } catch (err) {
      console.error('Failed to delete category:', err);
      const message = err.response?.data?.message || 'Failed to delete category';
      showToast(message, 'error');
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const formatCategoryName = (slug) => {
    if (!slug) return '';
    return slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Skeleton width="100%" height="400px" />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error || 'Category not found'}</p>
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
      <Link to="/categories" className={styles.backLink}>
        <ArrowLeft size={18} />
        Back to Categories
      </Link>

      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.iconWrapper}>
            {category.parent_id ? (
              <Tag size={32} className={styles.icon} />
            ) : (
              <FolderTree size={32} className={styles.icon} />
            )}
          </div>
          <div className={styles.headerInfo}>
            <div className={styles.titleRow}>
              <div>
                <h1 className={styles.title}>{category.name}</h1>
                <p className={styles.slug}>{category.slug}</p>
              </div>
              <div className={styles.actions}>
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/categories/${id}/edit`)}
                >
                  <Edit size={18} />
                  Edit
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
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Category Information</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Name</span>
              <span className={styles.infoValue}>{category.name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Slug</span>
              <span className={styles.infoValue}>{category.slug}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Type</span>
              <span className={styles.infoValue}>
                {category.parent_id ? (
                  <Badge variant="warning">Subcategory</Badge>
                ) : (
                  <Badge variant="success">Main Category</Badge>
                )}
              </span>
            </div>
            {category.parent && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Parent Category</span>
                <span className={styles.infoValue}>
                  <Link to={`/categories/${category.parent.id}`} className={styles.parentLink}>
                    {category.parent.name}
                  </Link>
                </span>
              </div>
            )}
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Products Count</span>
              <span className={styles.infoValue}>
                <Badge variant="default">
                  <Package size={14} />
                  {category.products_count || 0} products
                </Badge>
              </span>
            </div>
            {category.children && category.children.length > 0 && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Subcategories</span>
                <span className={styles.infoValue}>
                  <Badge variant="default">
                    {category.children.length} subcategories
                  </Badge>
                </span>
              </div>
            )}
          </div>
        </div>

        {category.children && category.children.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Subcategories</h2>
            <div className={styles.subcategoriesList}>
              {category.children.map((child) => (
                <Link
                  key={child.id}
                  to={`/categories/${child.id}`}
                  className={styles.subcategoryItem}
                >
                  <Tag size={16} />
                  <span>{child.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Category?"
      >
        <div className={styles.deleteModalContent}>
          <p>
            Are you sure you want to delete <strong>"{category.name}"</strong>?
            This action cannot be undone.
          </p>
          {category.products_count > 0 && (
            <p className={styles.warning}>
              This category has {category.products_count} associated products.
            </p>
          )}
          {category.children && category.children.length > 0 && (
            <p className={styles.warning}>
              This category has {category.children.length} subcategories.
            </p>
          )}
          <div className={styles.deleteModalActions}>
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={deleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CategoryDetail;

