import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "../config/env.config";

interface CustomSocket extends Socket {
  roomId?: string;
  userId?: string;
  email?: string;
}
let io: Server;

export const initializeSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_ORGIN,
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket: CustomSocket) => {
    console.log("User Connected ", socket.id);

    socket.on("join", (userId) => {
      console.log(`User Id ${userId}`);
      socket.join(userId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
  return io;
};
export const getIO = (): Server => {
  if (!io) throw new Error("Socket.io not initialized yet");
  return io;
};
