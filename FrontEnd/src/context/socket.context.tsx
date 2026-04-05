import { SocketEvents } from "@/constants/socketEvents";
import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./auth.context";

interface SocketContextType {
  socket: Socket | null;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
});

export const SocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user?.id) {
      // user logged out or not ready
      setSocket(null);
      return;
    }

    const newSocket = io(import.meta.env.VITE_BASE_URL, {
      query: { userId: user.id },
      transports: ["websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on(SocketEvents.CONNECT, () => {
      console.log("✅ Socket connected:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    newSocket.on(SocketEvents.DISCONNECT, (reason) => {
      console.warn("🔌 Socket disconnected:", reason);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [user?.id]);

  const value = useMemo(() => ({ socket }), [socket]);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
