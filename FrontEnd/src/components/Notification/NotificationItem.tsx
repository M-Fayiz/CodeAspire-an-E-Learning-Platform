import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { INotificationDTO } from "@/types/DTOS/notification.dto"; 
dayjs.extend(relativeTime);

interface Props {
  notification: INotificationDTO;
}

const typeColors: Record<string, string> = {
  success: "border-green-500 bg-green-50",
  error: "border-red-500 bg-red-50",
  info: "border-blue-500 bg-blue-50",
  warning: "border-yellow-500 bg-yellow-50",
};

const NotificationItem: React.FC<Props> = ({ notification }) => {
  const borderColor = notification.isRead
    ? "border-transparent"
    : typeColors[notification.type] || "border-gray-200";

  return (
    <div
      className={`rounded-2xl mt-1.5 px-4 py-3 border-l-4 ${borderColor} hover:bg-gray-50 transition`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-700">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-1">
            {dayjs(notification.createdAt).fromNow()} •{" "}
            {dayjs(notification.createdAt).format("hh:mm A")}
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default NotificationItem;
