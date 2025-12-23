import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './ProtectedRoute.module.css';

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  //loading spinner while checking auth
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Loading...</p>
      </div>
    );
  }
  // to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
