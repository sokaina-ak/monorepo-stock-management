import { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import categoryService from '../../services/categoryService';
import styles from './CategoryForm.module.css';

function CategoryForm({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Create Category',
}) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parent_id: '',
  });
  
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        slug: initialData.slug || '',
        parent_id: initialData.parent_id || '',
      });
    }
  }, [initialData]);

  // Fetch main categories for parent selection
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await categoryService.getMainCategories();
        // Filter out current category if editing
        const filtered = initialData 
          ? data.filter(cat => cat.id !== initialData.id)
          : data;
        setCategories(filtered || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    }));
    if (errors.name) {
      setErrors((prev) => ({
        ...prev,
        name: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const submitData = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      parent_id: formData.parent_id || null,
    };
    onSubmit(submitData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <div className={styles.mainSection}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Category Information</h3>
            <Input
              label="Category Name *"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Enter category name"
              error={errors.name}
            />
            <Input
              label="Slug *"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="category-slug"
              error={errors.slug}
            />
            <div className={styles.inputGroup}>
              <label className={styles.label}>Parent Category (Optional)</label>
              <select
                name="parent_id"
                value={formData.parent_id}
                onChange={handleChange}
                className={styles.select}
                disabled={loadingCategories}
              >
                <option value="">{loadingCategories ? 'Loading...' : 'None (Main Category)'}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <p className={styles.hint}>
                Select a parent category to make this a subcategory. Leave empty for a main category.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default CategoryForm;

