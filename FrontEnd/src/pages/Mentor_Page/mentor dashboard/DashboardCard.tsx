import { TrendingUp } from "lucide-react";
import type React from "react";
import type { ReactNode } from "react";

interface statCardProps {
  Icon: ReactNode;
  title: string;
  value: number;
  bgColor: string;
}

const StatCard: React.FC<statCardProps> = ({ Icon, title, value, bgColor }) => (
  <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-100">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className={`${bgColor} p-3 rounded-lg`}>{Icon}</div>
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {Math.floor(value)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-green-500">
        <TrendingUp className="w-4 h-4" />
        {/* <span className="text-xs font-medium">{trend}</span> */}
      </div>
    </div>
  </div>
);
export default StatCard;
