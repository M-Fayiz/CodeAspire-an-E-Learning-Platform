import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { io, Socket } from "socket.io-client";


interface SocketContextType {
  socket: Socket | null;
}


const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  userId?: string;    
  children: ReactNode;  
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ userId, children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
      console.log('user id from the ',userId)
    if (userId) {
      const newSocket = io('http://localhost:4000', {
        query: { userId },
        transports: ["websocket"],
      });

       newSocket.on("connect", () => {
      console.log("✅ Connected to backend with id:", newSocket.id);
    });
    newSocket.on("connect_error", (err) => {
      console.error("❌ Connection Error:", err.message);
    });
     newSocket.on("disconnect", (reason) => {
      console.log("🔌 Disconnected:", reason);
    });
      newSocket.emit("join", userId);

      setSocket(newSocket);
      console.log("Socket connected for user:", userId);

      return () => {
        newSocket.disconnect();
        console.log("Socket disconnected");
      };
    }
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};


export const useSocket = (): Socket | null => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context.socket;
};
