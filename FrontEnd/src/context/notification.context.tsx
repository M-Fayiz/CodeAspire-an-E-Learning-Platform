import React, { createContext, useContext } from "react";
import { useNotifications } from "@/hooks/useNotification";
import { useAuth } from "./auth.context";

const NotificationContext = createContext<ReturnType<
  typeof useNotifications
> | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const value = useNotifications(user?.id ?? "");

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    return {
      loading: false,
      unreadNotifications: [],
      readNotifications: [],
      markAsRead: async () => {},
      count: 0,
    };
  }
  return context;
};

