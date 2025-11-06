import { useState, useCallback } from 'react';
import Toast from './Toast';

interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

let toastIdCounter = 0;

export const useToast = () => {
  const [_toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${toastIdCounter++}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return { showToast, removeToast };
};

export const ToastContainer = ({ toasts, removeToast }: { toasts: ToastMessage[]; removeToast: (id: string) => void }) => {
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

