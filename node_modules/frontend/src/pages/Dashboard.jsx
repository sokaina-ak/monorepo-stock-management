import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  ArrowUpRight,
  Clock,
  CheckCircle,
  UserPlus,
  CreditCard,
  Edit,
  Star,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Skeleton from '../components/common/Skeleton';
import productService from '../services/productService';
import styles from './Dashboard.module.css';


function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  // all states for api data
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  // fetch data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // fetch all data together
        const [productsData, categoriesData] = await Promise.all([
          productService.getAll(200, 0), //can change needed limit
          productService.getCategories(),
        ]);
        //set total products and categories
        setTotalProducts(productsData.products?.length || productsData.total || 0);
        // Categories can be array of slugs (strings) or objects with slug/name
        const categorySlugs = categoriesData.map(cat => typeof cat === 'string' ? cat : (cat.slug || cat.name || cat));
        setCategories(categorySlugs.slice(0, 5));
        //top 5 products by rating
        const sortedByRating = [...productsData.products]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 5);
        setTopProducts(sortedByRating);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

//here formating all what i want to be clean
  //format current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  // greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  //format price
  const formatPrice = (price) => `$${price.toFixed(2)}`;
  //capitalize helper
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
  //info about app but here are just place holders except products from api
  const stats = [
    {
      label: 'Total Sales',
      value: '$24,567',
      trend: '+12.5%',
      trendUp: true,
      trendLabel: 'vs last month',
      icon: DollarSign,
      color: 'var(--color-success)',
      bgColor: 'var(--color-success-light)',
    },
    {
      label: 'Active Users',
      value: '1,234',
      trend: '+8.2%',
      trendUp: true,
      trendLabel: 'vs last week',
      icon: Users,
      color: 'var(--color-accent)',
      bgColor: 'var(--color-accent-light)',
    },
    {
      label: 'Orders',
      value: '456',
      trend: '-3.1%',
      trendUp: false,
      trendLabel: 'vs yesterday',
      icon: ShoppingCart,
      color: 'var(--color-warning)',
      bgColor: 'var(--color-warning-light)',
    },
    {
      label: 'Products',
      value: totalProducts.toString(),
      trend: '+5',
      trendUp: true,
      trendLabel: 'from API',
      icon: Package,
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
    },
  ];
  const recentActivity = [
    {
      id: 1,
      type: 'order',
      icon: CreditCard,
      color: 'var(--color-success)',
      title: 'New order received',
      description: 'Order #1234 - iPhone 15 Pro',
      time: '2 min ago',
    },
    {
      id: 2,
      type: 'user',
      icon: UserPlus,
      color: 'var(--color-accent)',
      title: 'New user registered',
      description: 'john.doe@example.com',
      time: '15 min ago',
    },
    {
      id: 3,
      type: 'product',
      icon: Edit,
      color: 'var(--color-warning)',
      title: 'Product updated',
      description: 'MacBook Pro - Price changed',
      time: '1 hour ago',
    },
    {
      id: 4,
      type: 'order',
      icon: CheckCircle,
      color: 'var(--color-success)',
      title: 'Order completed',
      description: 'Order #1230 delivered',
      time: '2 hours ago',
    },
  ];

  //quick colors for category bars
  const categoryColors = [
    'var(--color-accent)',
    'var(--color-success)',
    'var(--color-warning)',
    '#8B5CF6',
    '#EC4899',
  ];
  return (
    <div className={styles.dashboard}>
      {/*welcome Section */}
      <div className={styles.welcomeSection}>
        <div className={styles.welcomeContent}>
          <span className={styles.welcomeLabel}>{getGreeting()}</span>
          <h1 className={styles.welcomeTitle}>
            Welcome back, {user?.firstName || 'User'}!
          </h1>
          <p className={styles.welcomeDate}>{currentDate}</p>
        </div>
        <div className={styles.welcomeActions}>
          <Button variant="primary" onClick={() => navigate('/products/new')}>
            <Plus size={18} />
            Add Product
          </Button>
        </div>
      </div>

      {/*state grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <Card key={stat.label} className={styles.statCard}>
            <div className={styles.statHeader}>
              <div
                className={styles.statIcon}
                style={{ backgroundColor: stat.bgColor }}
              >
                <stat.icon size={20} color={stat.color} />
              </div>
              <div className={`${styles.statTrend} ${stat.trendUp ? styles.trendUp : styles.trendDown}`}>
                {stat.trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{stat.trend}</span>
              </div>
            </div>
            <div className={styles.statBody}>
              <span className={styles.statValue}>
                {loading && stat.label === 'Products' ? '...' : stat.value}
              </span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
            <div className={styles.statFooter}>
              <span className={styles.statTrendLabel}>{stat.trendLabel}</span>
            </div>
          </Card>
        ))}
      </div>

      {/*main Content*/}
      <div className={styles.contentGrid}>
        {/* left Column */}
        <div className={styles.leftColumn}>
          {/*categories from api */}
          <Card className={styles.quickStatsCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Product Categories</h2>
            </div>
            <div className={styles.quickStatsList}>
              {loading ? (
                //loading skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={styles.quickStatItem}>
                    <Skeleton width="100%" height="32px" />
                  </div>
                ))
              ) : (
                categories.map((cat, index) => (
                  <div key={cat} className={styles.quickStatItem}>
                    <div className={styles.quickStatInfo}>
                      <span className={styles.quickStatLabel}>{capitalize(cat)}</span>
                    </div>
                    <div className={styles.quickStatBar}>
                      <div
                        className={styles.quickStatFill}
                        style={{
                          width: `${85 - index * 15}%`,
                          backgroundColor: categoryColors[index % categoryColors.length],
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/*recent activity*/}
          <Card className={styles.activityCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Recent Activity</h2>
              <button className={styles.viewAllBtn}>View all</button>
            </div>
            <div className={styles.activityList}>
              {recentActivity.map((activity) => (
                <div key={activity.id} className={styles.activityItem}>
                  <div
                    className={styles.activityIcon}
                    style={{ backgroundColor: `${activity.color}15`, color: activity.color }}
                  >
                    <activity.icon size={16} />
                  </div>
                  <div className={styles.activityContent}>
                    <span className={styles.activityTitle}>{activity.title}</span>
                    <span className={styles.activityDesc}>{activity.description}</span>
                  </div>
                  <div className={styles.activityTime}>
                    <Clock size={12} />
                    <span>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* right column */}
        <div className={styles.rightColumn}>
          {/*top products by rating from api */}
          <Card className={styles.topProductsCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Top Rated Products</h2>
              <button
                className={styles.viewAllBtn}
                onClick={() => navigate('/products')}
              >
                View all
              </button>
            </div>
            <div className={styles.productsList}>
              {loading ? (
                //loading skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={styles.productItem}>
                    <Skeleton width="24px" height="24px" />
                    <Skeleton width="44px" height="44px" />
                    <div style={{ flex: 1 }}>
                      <Skeleton width="80%" height="16px" />
                      <Skeleton width="50%" height="12px" />
                    </div>
                  </div>
                ))
              ) : (
                topProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={styles.productItem}
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <div className={styles.productRank}>#{index + 1}</div>
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className={styles.productImage}
                    />
                    <div className={styles.productInfo}>
                      <span className={styles.productName}>{product.title}</span>
                      <span className={styles.productCategory}>{capitalize(product.category)}</span>
                    </div>
                    <div className={styles.productStats}>
                      <span className={styles.productRating}>
                        <Star size={12} fill="var(--color-warning)" color="var(--color-warning)" />
                        {product.rating.toFixed(1)}
                      </span>
                      <span className={styles.productRevenue}>{formatPrice(product.price)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/*quick actions */}
          <Card className={styles.quickActionsCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Quick Actions</h2>
            </div>
            <div className={styles.quickActionsList}>
              <button
                className={styles.quickActionBtn}
                onClick={() => navigate('/products')}
              >
                <div className={styles.quickActionIcon}>
                  <Package size={20} />
                </div>
                <span>View Products</span>
                <ArrowUpRight size={16} className={styles.quickActionArrow} />
              </button>
              <button
                className={styles.quickActionBtn}
                onClick={() => navigate('/products/new')}
              >
                <div className={styles.quickActionIcon}>
                  <Plus size={20} />
                </div>
                <span>Add New Product</span>
                <ArrowUpRight size={16} className={styles.quickActionArrow} />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
