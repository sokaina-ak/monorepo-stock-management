import { useState } from 'react';
import styles from './Avatar.module.css';

function Avatar({ name = '', size = 'md', src, className = '' }) {
  const [imageError, setImageError] = useState(false);
  
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ').filter(part => part.length > 0);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const isValidImage = src && src.trim() !== '' && !src.includes('example.com') && !src.includes('placeholder');

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`${styles.avatar} ${styles[size]} ${className}`}>
      {src && isValidImage && !imageError ? (
        <img 
          src={src} 
          alt={name} 
          className={styles.image}
          onError={handleImageError}
        />
      ) : (
        <span className={styles.initials}>{getInitials(name)}</span>
      )}
    </div>
  );
}

export default Avatar;
