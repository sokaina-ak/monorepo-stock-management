import styles from './EmptyState.module.css';

function EmptyState({
  title,
  description,
  action,
  illustration,
  className = ''
}) {
  return (
    <div className={`${styles.emptyState} ${className}`}>
      {illustration && (
        <img
          src={illustration}
          alt=""
          className={styles.illustration}
        />
      )}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

export default EmptyState;
