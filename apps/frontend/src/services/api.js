import axios from 'axios';

// Use proxy in dev, or env var in production
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//attach authentication tokens to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
//for expired or invalid tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401 Unauthorized responses, not network errors
    if (error.response && error.response.status === 401) {
      //clear stored tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      //only if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
