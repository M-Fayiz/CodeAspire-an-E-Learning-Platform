import React from "react";

interface SlotCardProps {
  startTime: string;
  endTime: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const SlotCard: React.FC<SlotCardProps> = ({
  startTime,
  endTime,
  isSelected = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center justify-center
        border rounded-xl cursor-pointer
        px-6 py-3 transition-all duration-200
        ${isSelected 
          ? "bg-black text-white border-black shadow-md" 
          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"}
      `}
    >
      <span className="text-sm font-medium tracking-wide">
        {startTime} – {endTime}
      </span>
    </div>
  );
};

export default SlotCard;
