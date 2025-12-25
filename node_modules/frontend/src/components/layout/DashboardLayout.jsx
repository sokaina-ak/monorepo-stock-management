import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './DashboardLayout.module.css';


function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <motion.div
        className={styles.main}
        animate={{ marginLeft: isMobile ? 0 : (sidebarOpen ? 260 : 72) }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Header />
        <main className={styles.content}>
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
}

export default DashboardLayout;
