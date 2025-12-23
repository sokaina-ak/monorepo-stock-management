import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Eye, FolderTree, Tag } from 'lucide-react';
import Badge from '../common/Badge';
import styles from './CategoryCard.module.css';

function CategoryCard({ category, onDelete }) {
  const navigate = useNavigate();

  const formatCategoryName = (slug) => {
    if (!slug) return '';
    return slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleCardClick = () => {
    navigate(`/categories/${category.id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/categories/${category.id}/edit`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(category);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    navigate(`/categories/${category.id}`);
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          {category.parent_id ? (
            <Tag size={24} className={styles.icon} />
          ) : (
            <FolderTree size={24} className={styles.icon} />
          )}
        </div>
        <div className={styles.overlay} />
        <div className={styles.quickActions}>
          <button
            className={styles.quickBtn}
            onClick={handleQuickView}
            title="View Details"
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

      <div className={styles.content}>
        <h3 className={styles.title}>{category.name || 'Unnamed Category'}</h3>
        <p className={styles.slug}>{category.slug || 'no-slug'}</p>
        
        <div className={styles.badges}>
          {category.parent_id ? (
            <Badge variant="warning">Subcategory</Badge>
          ) : (
            <Badge variant="success">Main Category</Badge>
          )}
          {category.parent_slug && (
            <Badge variant="default">Parent: {formatCategoryName(category.parent_slug)}</Badge>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryCard;

