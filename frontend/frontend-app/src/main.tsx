import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { SidebarProvider } from './context/SidebarContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SidebarProvider>
        <App />
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: '#1a1a24', color: '#fff', border: '1px solid rgba(6, 182, 212, 0.3)' } }} />
      </SidebarProvider>
    </BrowserRouter>
  </React.StrictMode>
);