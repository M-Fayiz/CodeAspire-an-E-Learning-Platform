import { useEffect, useState, useMemo, useCallback } from "react";
import type { INotificationDTO } from "@/types/DTOS/notification.dto";
import { NotificationService } from "@/service/notification.service";

import { toast } from "sonner";
import { ApiError } from "@/utility/apiError.util";
import { useSocket } from "./useSocket";

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<INotificationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const socket = useSocket();

  useEffect(() => {
  if (!userId) {
    setNotifications([]);
    setCount(0);
    setLoading(false);
    return;
  }

  (async () => {
    try {
      setLoading(true);
      const data = await NotificationService.getNotification(userId);

      if (data) {
        const sorted = data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        );
        setNotifications(sorted);
        setCount(sorted.filter((n) => !n.isRead).length);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  })();
}, [userId]);


  useEffect(() => {
    if (!socket) return;

    const handleNotification = (payload: INotificationDTO) => {
      switch (payload.type) {
        case "error":
          toast.error(payload.message);
          break;
        case "info":
          toast.info(payload.message);
          break;
        case "success":
          toast.success(payload.message);
      }
      setNotifications((prev) => [payload, ...prev]);
      setCount((prev) => prev + 1);
    };

    socket.on("notification", handleNotification);
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket]);

  const markAsRead = useCallback(async (id: string) => {
    const success = await NotificationService.readNotification(id);
    if (success) {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
      setCount((prev) => Math.max(prev - 1, 0));
    }
  }, []);

  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.isRead),
    [notifications],
  );
  const readNotifications = useMemo(
    () => notifications.filter((n) => n.isRead),
    [notifications],
  );

  return { loading, unreadNotifications, readNotifications, markAsRead, count };
}
