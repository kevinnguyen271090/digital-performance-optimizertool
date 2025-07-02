import React, { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ type, title, message, duration = 5000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-success/10 border-success/20",
          icon: <CheckCircle className="w-5 h-5 text-success" />,
          titleColor: "text-success",
        };
      case "error":
        return {
          bg: "bg-danger/10 border-danger/20",
          icon: <XCircle className="w-5 h-5 text-danger" />,
          titleColor: "text-danger",
        };
      case "warning":
        return {
          bg: "bg-yellow-100 border-yellow-200",
          icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
          titleColor: "text-yellow-800",
        };
      case "info":
        return {
          bg: "bg-accent/10 border-accent/20",
          icon: <Info className="w-5 h-5 text-accent" />,
          titleColor: "text-accent",
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full bg-white border rounded-lg shadow-lg p-4 ${styles.bg} animate-slide-in`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">{styles.icon}</div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${styles.titleColor}`}>{title}</p>
          {message && <p className="mt-1 text-sm text-gray-600">{message}</p>}
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={onClose}
            className="inline-flex text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast Manager Component
interface ToastManagerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
  }>;
  onClose: (id: string) => void;
}

export const ToastManager: React.FC<ToastManagerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={() => onClose(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast; 