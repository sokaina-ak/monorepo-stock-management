import { useState, useEffect } from 'react';
import { ImagePlus } from 'lucide-react';

import Input from '../common/Input';
import Button from '../common/Button';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';

import styles from './ProductForm.module.css';


function ProductForm({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Create Product',
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    stock: '',
    thumbnail: '',
  });
  
  //prod info in edit
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price?.toString() || '',
        category: initialData.category || '',
        brand: initialData.brand || '',
        stock: initialData.stock?.toString() || '',
        thumbnail: initialData.thumbnail || '',
      });
      setImagePreview(initialData.thumbnail || '');
    }
  }, [initialData]);

  useEffect(() => {
    if (formData.thumbnail && isValidUrl(formData.thumbnail)) {
      setImagePreview(formData.thumbnail);
    }
  }, [formData.thumbnail]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await categoryService.getCategories();
        console.log('ProductForm - Fetched categories:', data); // Debug log
        if (Array.isArray(data) && data.length > 0) {
          // categoryService returns category objects with id, name, slug, etc.
          setCategories(data);
        } else {
          console.warn('No categories found or invalid data format');
          setCategories([]);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        console.error('Error details:', err.response?.data || err.message);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);
  
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  //input changes by name
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    //remove error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  //validate form before submit
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price)|| parseFloat(formData.price)<0) {
      newErrors.price = 'Price must be a positive number';
    }
    if (formData.stock && (isNaN(formData.stock)|| parseInt(formData.stock) < 0)) {
      newErrors.stock = 'Stock must be a positive number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //form submission
  const handleSubmit = (e) => {
    e.preventDefault(); //no refesh
    if (!validateForm()) return;
    const submitData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      category: formData.category.trim() || 'other',
      brand: formData.brand.trim(),
      stock: formData.stock ? parseInt(formData.stock) : 0,
      thumbnail: formData.thumbnail.trim(),
    };
    onSubmit(submitData);
  };

  // Format category name for display
  const formatCategoryName = (slug) => {
    if (!slug) return '';
    return slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        {/*prod info disolay*/}
        <div className={styles.mainSection}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Basic Information</h3>
            <Input
              label="Product Title *"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter product title"
              error={errors.title}
            />
            <div className={styles.inputGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                className={styles.textarea}
                rows={4}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={styles.select}
                disabled={loadingCategories}
              >
                <option value="">{loadingCategories ? 'Loading categories...' : 'Select a category'}</option>
                {categories.map((cat) => {
                  const slug = typeof cat === 'string' ? cat : (cat.slug || cat.name);
                  const name = typeof cat === 'string' ? cat : (cat.name || cat.slug);
                  return (
                    <option key={slug} value={slug}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>
            <Input
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Enter brand name"
            />
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Pricing & Inventory</h3>
            <div className={styles.row}>
              <Input
                label="Price $"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                error={errors.price}
              />
              <Input
                label="Stock Quantity"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                error={errors.stock}
              />
            </div>
          </div>
        </div>
        <div className={styles.imageSection}>
          <h3 className={styles.sectionTitle}>Product Image</h3>
          <div className={styles.imagePreviewBox}>
            {imagePreview ? (
              <img src={imagePreview} alt="Product preview" className={styles.previewImage} />
            ) : (
              <div className={styles.imagePlaceholder}>
                <ImagePlus size={48} />
                <span>Image Preview</span>
              </div>
            )}
          </div>
          <Input
            label="Thumbnail URL"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            error={errors.thumbnail}
          />
          <p className={styles.imageHint}>
            Enter a URL to an image. The preview will update automatically.
          </p>
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

export default ProductForm;
