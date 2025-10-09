import { AlertCircle, Check, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ToastProps {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
  duration?: number;
}

export const NotificationToast: React.FC<ToastProps> = ({ 
  title, 
  message, 
  type = 'info', 
  onClose,
  duration = 5000 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'border-l-4 border-orange-500 bg-gray-900';
      case 'error':
        return 'border-l-4 border-red-500 bg-gray-900';
      case 'warning':
        return 'border-l-4 border-yellow-500 bg-gray-900';
      default:
        return 'border-l-4 border-orange-500 bg-gray-900';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5 text-orange-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-orange-500" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`${getTypeStyles()} rounded-lg shadow-lg p-4 mb-4 max-w-md animate-slide-in`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-sm mb-1">{title}</h4>
          <p className="text-gray-300 text-sm">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
