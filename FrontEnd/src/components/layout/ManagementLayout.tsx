import React, { type ReactNode } from "react";

interface ManagementProps {
  title: string;
  description?: string;
  children: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
}
const ManagementLayout: React.FC<ManagementProps> = ({
  title,
  description,
  children,
  icon,
  action,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 py-2">
      <div className=" px-2 sm:px-3 lg:px-5 space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            {icon && <div className="mt-1 text-gray-700">{icon}</div>}

            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-700">
                {title}
              </h1>

              {description && (
                <p className="mt-1 text-sm sm:text-base text-gray-500 max-w-2xl">
                  {description}
                </p>
              )}
            </div>
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200" />

        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default ManagementLayout;
