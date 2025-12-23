import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import notFoundIllustration from '../assets/images/undraw_page-not-found_6wni.svg';
import styles from './NotFound.module.css';


function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>

        <img
          src={notFoundIllustration}
          alt="Page not found"
          className={styles.illustration}
        />
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.description}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className={styles.actions}>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            <Home size={18} />
            Go to Dashboard
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
export default NotFound;
