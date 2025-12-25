import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  LogOut,
  X,
  Menu,
  ChevronsRight,
  FileQuestion,
  Tag,
  ShoppingCart,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import styles from './Sidebar.module.css';


function Sidebar({ isOpen, setIsOpen }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Products', href: '/products', icon: Package },
    { label: 'Categories', href: '/categories', icon: Tag },
    { label: 'Orders', href: '/orders', icon: ShoppingCart },
    { label: 'Reports', href: '/reports', icon: FileQuestion },
  ];
  // handle logout
  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  return (
    <>
      {/* desktop sidebar */}
      <motion.aside
        className={styles.sidebar}
        animate={{ width: isOpen ? 260 : 72 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className={styles.gradientStrip} />
        {/* logo and title section */}
        <div className={styles.titleSection}>
          <div className={styles.logoWrapper}>
            <div className={styles.logo}>
              <Package size={20} />
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className={styles.titleInfo}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className={styles.titleText}>Admin Panel</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* navigation links */}
        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              <div className={styles.navIconWrapper}>
                <link.icon size={18} />
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    className={styles.navLabel}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* logout button at bottom */}
        <div className={styles.userSection}>
          <button
            className={styles.logoutButton}
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={18} />
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
        {/* Toggle button at bottom */}
        <button
          className={styles.toggleButton}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className={styles.toggleIconWrapper}
          >
            <ChevronsRight size={18} />
          </motion.div>
          <AnimatePresence>
            {isOpen && (
              <motion.span
                className={styles.toggleLabel}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </motion.aside>
      {/* Mobile Header Bar */}
      <div className={styles.mobileHeader}>
        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <span className={styles.mobileTitle}>Admin Panel</span>
      </div>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className={styles.mobileBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
            />
            {/* Mobile Sidebar */}
            <motion.aside
              className={styles.mobileSidebar}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {/* Gradient accent strip */}
              <div className={styles.gradientStrip} />

              {/* Header with close button */}
              <div className={styles.mobileCloseSection}>
                <div className={styles.titleSection} style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
                  <div className={styles.logoWrapper}>
                    <div className={styles.logo}>
                      <Package size={20} />
                    </div>
                    <div className={styles.titleInfo}>
                      <span className={styles.titleText}>Admin Panel</span>
                    </div>
                  </div>
                </div>
                <button
                  className={styles.mobileCloseButton}
                  onClick={() => setIsMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation links */}
              <nav className={styles.nav}>
                {navLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    className={({ isActive }) =>
                      `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                    }
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <div className={styles.navIconWrapper}>
                      <link.icon size={18} />
                    </div>
                    <span className={styles.navLabel}>{link.label}</span>
                  </NavLink>
                ))}
              </nav>

              {/* Logout button at bottom */}
              <div className={styles.userSection}>
                <button className={styles.logoutButton} onClick={handleLogout}>
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
export default Sidebar;
