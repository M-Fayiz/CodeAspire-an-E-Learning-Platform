import React from "react";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ToastStatus = "success" | "error" | "warning" | "info";

interface ToastConfig {
  icon: LucideIcon;
  bgColor: string;
  borderColor: string;
  iconColor: string;
  textColor: string;
  titleColor: string;
}

interface CustomToastProps {
  message: string;
  status: ToastStatus;
  onDismiss: () => void;
}

const CustomToast: React.FC<CustomToastProps> = ({
  message,
  status,
  onDismiss,
}) => {
  const getStatusConfig = (status: ToastStatus): ToastConfig => {
    const configs: Record<ToastStatus, ToastConfig> = {
      success: {
        icon: CheckCircle,
        bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
        borderColor: "border-green-200",
        iconColor: "text-green-600",
        textColor: "text-green-800",
        titleColor: "text-green-900",
      },
      error: {
        icon: XCircle,
        bgColor: "bg-gradient-to-r from-red-50 to-rose-50",
        borderColor: "border-red-200",
        iconColor: "text-red-600",
        textColor: "text-red-800",
        titleColor: "text-red-900",
      },
      warning: {
        icon: AlertTriangle,
        bgColor: "bg-gradient-to-r from-yellow-50 to-amber-50",
        borderColor: "border-yellow-200",
        iconColor: "text-yellow-600",
        textColor: "text-yellow-800",
        titleColor: "text-yellow-900",
      },
      info: {
        icon: Info,
        bgColor: "bg-gradient-to-r from-blue-50 to-indigo-50",
        borderColor: "border-blue-200",
        iconColor: "text-blue-600",
        textColor: "text-blue-800",
        titleColor: "text-blue-900",
      },
    };
    return configs[status];
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  const getTitle = (status: ToastStatus): string => {
    const titles: Record<ToastStatus, string> = {
      success: "Success!",
      error: "Error!",
      warning: "Warning!",
      info: "Information",
    };
    return titles[status];
  };

  return (
    <div
      className={`max-w-md w-full ${config.bgColor} shadow-lg rounded-lg pointer-events-auto border ${config.borderColor}`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <IconComponent className={`h-6 w-6 ${config.iconColor}`} />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className={`text-sm font-semibold ${config.titleColor}`}>
              {getTitle(status)}
            </p>
            <p className={`mt-1 text-sm ${config.textColor}`}>{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onDismiss}
              className={`inline-flex ${config.textColor} hover:${config.iconColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md p-1 transition-colors duration-200`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const showToast = (message: string, status: ToastStatus = "info"): string => {
  const toastId = toast.custom(
    (t) => (
      <CustomToast
        message={message}
        status={status}
        onDismiss={() => toast.dismiss(t.id)}
      />
    ),
    {
      duration: 4000,
      position: "top-right",
    },
  );
  return toastId;
};

interface ToastService {
  success: (message: string) => string;
  error: (message: string) => string;
  warning: (message: string) => string;
  info: (message: string) => string;
  custom: (message: string, status: ToastStatus) => string;
  dismiss: (toastId?: string) => void;
  dismissAll: () => void;
}

export const toastService: ToastService = {
  success: (message: string) => showToast(message, "success"),
  error: (message: string) => showToast(message, "error"),
  warning: (message: string) => showToast(message, "warning"),
  info: (message: string) => showToast(message, "info"),
  custom: showToast,
  dismiss: (toastId?: string) => toast.dismiss(toastId),
  dismissAll: () => toast.dismiss(),
};
