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

// const ToastDemo: React.FC = () => {
//   const handleToast = (type: ToastStatus): void => {
//     const messages: Record<ToastStatus, string> = {
//       success: 'Your changes have been saved successfully!',
//       error: 'Failed to connect to the server. Please try again.',
//       warning: 'Your session will expire in 5 minutes.',
//       info: 'New updates are available for your application.'
//     };

//     toastService[type](messages[type]);
//   };

//   const handleCustomToast = (): void => {
//     toastService.custom(
//       'This is a custom toast message',
//       'success'
//     );
//   };

//   const handlePromiseToast = (): void => {
//     const myPromise = new Promise<string>((resolve, reject) => {
//       setTimeout(() => {
//         Math.random() > 0.5
//           ? resolve('Data loaded successfully!')
//           : reject(new Error('Failed to load data'));
//       }, 2000);
//     });

//     const loadingToastId = showToast('Loading data...', 'info');

//     myPromise
//       .then((message: string) => {
//         toast.dismiss(loadingToastId);
//         toastService.success(message);
//       })
//       .catch((error: Error) => {
//         toast.dismiss(loadingToastId);
//         toastService.error(error.message || 'An error occurred');
//       });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
//       <div className="max-w-4xl mx-auto">

//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Dynamic Toast System
//           </h1>
//           <p className="text-lg text-gray-600">
//             React Hot Toast with TypeScript, custom styling and dynamic messages
//           </p>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-6">Test Toast Messages</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//             <button
//               onClick={() => handleToast('success')}
//               className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
//             >
//               <CheckCircle className="h-5 w-5" />
//               <span>Success</span>
//             </button>

//             <button
//               onClick={() => handleToast('error')}
//               className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
//             >
//               <XCircle className="h-5 w-5" />
//               <span>Error</span>
//             </button>

//             <button
//               onClick={() => handleToast('warning')}
//               className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
//             >
//               <AlertTriangle className="h-5 w-5" />
//               <span>Warning</span>
//             </button>

//             <button
//               onClick={() => handleToast('info')}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
//             >
//               <Info className="h-5 w-5" />
//               <span>Info</span>
//             </button>
//           </div>

//           <div className="flex flex-wrap gap-4">
//             <button
//               onClick={handleCustomToast}
//               className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
//             >
//               Custom Toast
//             </button>

//             <button
//               onClick={handlePromiseToast}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
//             >
//               Promise-based Toast
//             </button>

//             <button
//               onClick={() => toastService.dismissAll()}
//               className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
//             >
//               Dismiss All
//             </button>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-8">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Simple Usage Examples</h2>
//           <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
//             <div className="text-gray-800">
//               <div className="text-green-600">// Import the toast service and types</div>
//               <div>import &#123; toastService, ToastStatus &#125; from './ToastSystem';</div>
//               <br />
//               <div className="text-green-600">// Basic usage</div>
//               <div>toastService.success('Operation completed!');</div>
//               <div>toastService.error('Something went wrong!');</div>
//               <div>toastService.warning('Please check your input.');</div>
//               <div>toastService.info('Here\'s some information.');</div>
//               <br />
//               <div className="text-green-600">// Custom with type safety</div>
//               <div>const status: ToastStatus = 'warning';</div>
//               <div>toastService.custom('Custom message', status);</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Toaster
//         position="top-center"
//         gutter={12}
//         containerStyle={{
//           top: 20,
//         }}
//         toastOptions={{
//           duration: 4000,
//           style: {
//             background: 'transparent',
//             boxShadow: 'none',
//             padding: 0,
//           },
//         }}
//       />
//     </div>
//   );
// };

// export default ToastDemo;
