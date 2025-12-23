import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  //check for existing session
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          //verify token so fetching current user
          const userData = await authService.getMe();
          setUser(userData);
        } catch (error) {
          //if invalid clear storage
          console.error('Session expired:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    //store tokens and user data
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    const userData = data;
    //i can add execluding tokens but i had error
    setUser(userData);
    return userData;
  };
  //clear all auth data
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };
  //creating one object that contains all values عشان نشاركها فالابب كله
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };
  //without passing props manually through eahc component
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

