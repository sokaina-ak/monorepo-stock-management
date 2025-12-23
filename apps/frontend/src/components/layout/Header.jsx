import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../common/Avatar';
import styles from './Header.module.css';


function Header() {
  const location = useLocation();
  const { user } = useAuth();

  //title on route
        const getPageTitle = () => {
          const path = location.pathname;
          if (path === '/dashboard') return 'Dashboard';
          if (path === '/products') return 'Products';
          if (path === '/products/new') return 'Add Product';
          if (path.match(/\/products\/\d+\/edit/)) return 'Edit Product';
          if (path.match(/\/products\/\d+/)) return 'Product Details';
          if (path === '/categories') return 'Categories';
          if (path === '/categories/new') return 'Add Category';
          if (path.match(/\/categories\/\d+\/edit/)) return 'Edit Category';
          if (path.match(/\/categories\/\d+/)) return 'Category Details';
          return 'Dashboard';
        };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{getPageTitle()}</h1>
      <div className={styles.userSection}>
        <span className={styles.userName}>
          {user?.firstName} {user?.lastName}
        </span>
        <Avatar
          name={`${user?.firstName} ${user?.lastName}`}
          src={user?.image}
          size="sm"
        />
      </div>
    </header>
  );
}
export default Header;
