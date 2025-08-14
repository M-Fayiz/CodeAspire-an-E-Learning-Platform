import React, { type ReactNode } from "react";

interface ManagementProps {
  title: string;
  description: string;
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
    <div className="min-h-screen bg-gray-50  md:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="pl-2">
            <div className="flex">
              {icon && <span>{icon}</span>}

              <div className="flex flex-col pl-3 ">
                <h1 className="text-2xl font-bold text-gray-700">{title}</h1>
                <p className="text-gray-600 mt-1">{description}</p>
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};
export default ManagementLayout;
