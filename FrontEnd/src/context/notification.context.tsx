// src/context/NotificationContext.tsx
import React, { createContext, useContext } from "react";
import { useNotifications } from "@/hooks/useNotification";

const NotificationContext = createContext<ReturnType<
  typeof useNotifications
> | null>(null);

export const NotificationProvider: React.FC<{
  userId: string;
  children: React.ReactNode;
}> = ({ userId, children }) => {
  const value = useNotifications(userId);
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used inside NotificationProvider",
    );
  }
  return context;
};
