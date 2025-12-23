import styles from './Skeleton.module.css';

function Skeleton({
  variant = 'rectangle',
  width = '100%',
  height = '20px',
  className = ''
}) {
  return (
    <div
      className={`${styles.skeleton} ${styles[variant]} ${className}`}
      style={{ width, height }}
      aria-label="Loading..."
    />
  );
}

export default Skeleton;
