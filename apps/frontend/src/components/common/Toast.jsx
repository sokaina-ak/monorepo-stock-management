import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import styles from './Toast.module.css';

function Toast({ toasts, onRemove }) {
  if (toasts.length === 0) return null;
  //based on toast type
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className={styles.iconSuccess} />;
      case 'error':
        return <XCircle size={20} className={styles.iconError} />;
      case 'info':
      default:
        return <Info size={20} className={styles.iconInfo} />;
    }
  };
  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          {getIcon(toast.type)}
          <span className={styles.message}>{toast.message}</span>
          <button
            className={styles.closeButton}
            onClick={() => onRemove(toast.id)}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Toast;
