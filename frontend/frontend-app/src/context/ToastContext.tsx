import React, { createContext, useContext, type ReactNode } from 'react';
import toast from 'react-hot-toast';

interface ToastContextType {
  success: (msg: string) => void;
  error: (msg: string) => void;
  loading: (msg: string) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const success = (msg: string) => toast.success(msg);
  const error = (msg: string) => toast.error(msg);
  const loading = (msg: string) => toast.loading(msg);
  const dismiss = (id: string) => toast.dismiss(id);
  
  return <ToastContext.Provider value={{ success, error, loading, dismiss }}>{children}</ToastContext.Provider>;
};