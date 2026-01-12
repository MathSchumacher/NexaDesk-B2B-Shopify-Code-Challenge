import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info, Sparkles } from 'lucide-react';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'ai';

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  onClose: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: X,
  warning: AlertTriangle,
  info: Info,
  ai: Sparkles
};

export const Toast = ({ id, type, message, onClose }: ToastProps) => {
  const Icon = icons[type];

  return (
    <motion.div
      className={`toast toast-${type}`}
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
    >
      <div className="toast-icon">
        <Icon size={18} />
      </div>
      <p className="toast-message">{message}</p>
      <button className="toast-close" onClick={() => onClose(id)}>
        <X size={14} />
      </button>
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: Array<{ id: string; type: ToastType; message: string }>;
  onClose: (id: string) => void;
}

export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
};
