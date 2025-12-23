import styles from './Avatar.module.css';

function Avatar({ name = '', size = 'md', src, className = '' }) {
  const getInitials = (name) => {
    if (!name) return '?';  };
  
    return (
    <div className={`${styles.avatar} ${styles[size]} ${className}`}>
      {src ? (
        <img src={src} alt={name} className={styles.image} />
      ) : (
        <span className={styles.initials}>{getInitials(name)}</span>
      )}
    </div>
  );
}

export default Avatar;
