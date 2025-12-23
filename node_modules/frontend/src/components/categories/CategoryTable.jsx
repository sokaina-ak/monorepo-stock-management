import { useNavigate } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import Badge from '../common/Badge';
import styles from './CategoryTable.module.css';

function CategoryTable({ categories, onDelete }) {
  const navigate = useNavigate();

  const formatCategoryName = (slug) => {
    if (!slug) return '';
    return slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleRowClick = (id) => {
    navigate(`/categories/${id}`);
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/categories/${id}/edit`);
  };

  const handleDelete = (e, category) => {
    e.stopPropagation();
    onDelete(category);
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thName}>Name</th>
            <th>Slug</th>
            <th>Type</th>
            <th>Parent</th>
            <th className={styles.thActions}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr
              key={category.id}
              onClick={() => handleRowClick(category.id)}
              className={styles.row}
            >
              <td>
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryName}>{category.name || 'Unnamed Category'}</span>
                </div>
              </td>
              <td>
                <span className={styles.slug}>{category.slug || 'no-slug'}</span>
              </td>
              <td>
                {category.parent_id ? (
                  <Badge variant="warning">Subcategory</Badge>
                ) : (
                  <Badge variant="success">Main Category</Badge>
                )}
              </td>
              <td>
                {category.parent_slug ? (
                  <span className={styles.parentName}>{formatCategoryName(category.parent_slug)}</span>
                ) : (
                  <span className={styles.noParent}>—</span>
                )}
              </td>
              <td>
                <div className={styles.actions}>
                  <button
                    className={styles.actionBtn}
                    onClick={(e) => handleEdit(e, category.id)}
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    onClick={(e) => handleDelete(e, category)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CategoryTable;

