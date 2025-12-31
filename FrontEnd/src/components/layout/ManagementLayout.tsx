import React, { type ReactNode } from "react";

interface ManagementProps {
  title: string;
  description?: string;
  children: ReactNode;
  icon?: ReactNode;
}

const ManagementLayout: React.FC<ManagementProps> = ({
  title,
  description,
  children,
  icon,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          
          <div className="flex items-start gap-3">
            {icon && (
              <div className="shrink-0 text-gray-700">
                {icon}
              </div>
            )}

            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                {title}
              </h1>

              {description && (
                <p className="mt-1 text-sm sm:text-base text-gray-500">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ManagementLayout;
