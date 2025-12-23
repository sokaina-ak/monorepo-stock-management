//call heplper functions i used for formate and clac


export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getStockStatus = (stock) => {
  if (stock === 0) {
    return { variant: 'error', label: 'Out of Stock' };
  }
  if (stock < 10) {
    return { variant: 'warning', label: 'Low Stock' };
  }
  return { variant: 'success', label: 'In Stock' };
};

export const calculateDiscountedPrice = (price, discountPercent) => {
  if (!discountPercent || discountPercent <= 0) {
    return price;
  }
  return price - (price * discountPercent / 100);
};

//to prevent overflowing text
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + '...';
};

export const getInitials = (firstName = '', lastName = '') => {
  const first = firstName.charAt(0).toUpperCase();
  const last = lastName.charAt(0).toUpperCase();
  return `${first}${last}`;
};


export const capitalizeWords = (text) => {
  if (!text) return '';
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatCategory = (slug) => {
  if (!slug) return '';
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

