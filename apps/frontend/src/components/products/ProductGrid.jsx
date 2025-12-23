import Skeleton from '../common/Skeleton';
import EmptyState from '../common/EmptyState';
import styles from './ProductGrid.module.css';


function ProductGrid({ products, loading, onClearSearch }) {
  
  //load cards while loading
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={styles.skeletonCard}>
            <Skeleton width="100%" height="200px" />
            <div className={styles.skeletonContent}>
              <Skeleton width="40%" height="14px" />
              <Skeleton width="80%" height="20px" />
              <Skeleton width="60%" height="14px" />
              <Skeleton width="30%" height="24px" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  //when no products
  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="Try adjusting your search or filters to find what you're looking for."
        actionLabel="Clear Search"
        onAction={onClearSearch}
      />
    );
  }

}

export default ProductGrid;
