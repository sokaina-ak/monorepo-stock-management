import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// global styles with css variables and reset
import './assets/styles/global.css';

// context providers for auth and toast notifications
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
