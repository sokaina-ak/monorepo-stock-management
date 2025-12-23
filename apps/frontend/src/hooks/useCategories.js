import { useState, useCallback, useEffect } from 'react';
import categoryService from '../services/categoryService';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getCategories();
      setCategories(data);
      return { success: true, data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch categories';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMainCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getMainCategories();
      setMainCategories(data);
      return { success: true, data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch main categories';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubcategories = useCallback(async (parentSlug) => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getSubcategories(parentSlug);
      return { success: true, data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch subcategories';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Optionally load main categories on mount
  useEffect(() => {
    fetchMainCategories();
  }, [fetchMainCategories]);

  return {
    categories,
    mainCategories,
    loading,
    error,
    fetchCategories,
    fetchMainCategories,
    fetchSubcategories,
    clearError: () => setError(null),
  };
};

export default useCategories;

