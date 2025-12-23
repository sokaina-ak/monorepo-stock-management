import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/common/Toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  
  const [toasts, setToasts] = useState([]);
  
  //remove a toast by id (used id so if there is more than one toast)
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);
  
  //add a new toast notification
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now(); //quick unique id
    setToasts((prev) => [...prev, { id, message, type }]);
    
    //auto-dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container - renders all active toasts */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

