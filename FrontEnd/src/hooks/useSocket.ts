import { SocketContext } from "@/context/socket.context";
import { useContext } from "react";
import type { Socket } from "socket.io-client";

export const useSocket = (): Socket | null => {
  const context = useContext(SocketContext);
  return context?.socket ?? null;
};
