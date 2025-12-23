import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import authIllustration from '../assets/images/undraw_authentication_1evl.svg';
import styles from './Login.module.css';


function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);
  //all states
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    //clear error when user starts typing
    if (error) setError('');
  };
  //submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.username, formData.password);
      showToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid username or password';
      setError(message);
      showToast('Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/*illustration*/}
      <div className={styles.illustrationSide}>
        <img
          src={authIllustration}
          alt="Authentication"
          className={styles.illustration}
        />
      </div>

      {/*login form */}
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Username"
            name="username"
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            error={error && !formData.username ? 'Username is required' : ''}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={error && !formData.password ? 'Password is required' : ''}
          />

          {/*error message */}
          {error && formData.username && formData.password && (
            <p className={styles.error}>{error}</p>
          )}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className={styles.submitButton}
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
export default Login;
