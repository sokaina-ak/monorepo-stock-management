import { Grid, List } from 'lucide-react';
import styles from './ViewToggle.module.css';

function ViewToggle({ view, onViewChange }) {
  return (
    <div className={styles.toggle}>
      <button
        className={`${styles.btn} ${view === 'grid' ? styles.active : ''}`}
        onClick={() => onViewChange('grid')}
        title="Grid view"
      >
        <Grid size={18} />
      </button>
      <button
        className={`${styles.btn} ${view === 'table' ? styles.active : ''}`}
        onClick={() => onViewChange('table')}
        title="Table view"
      >
        <List size={18} />
      </button>
    </div>
  );
}

export default ViewToggle;
