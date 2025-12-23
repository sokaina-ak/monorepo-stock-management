import styles from './Badge.module.css';

function Badge({ variant = 'default', children, className = '' }) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
