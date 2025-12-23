import styles from './Card.module.css';


function Card({ children, className = '', hoverable = false }) {
  return (
    <div className={`${styles.card} ${hoverable ? styles.hoverable : ''} ${className}`}>
      {children}
    </div>
  );
}

export default Card;
