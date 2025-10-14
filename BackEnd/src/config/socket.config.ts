
import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "../config/env.config";
import { verifyAccesToken } from "../utils/jwt-token.util";
import { createHttpError } from "../utils/http-error";
import { HttpStatus } from "../const/http-status";
import { HttpResponse } from "../const/error-message";

interface CustomSocket extends Socket {
  roomId?: string;
  user?:{_id:string,email:string}
}
let io: Server;

export const initializeSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_ORGIN,
      methods: ["GET", "POST"],
    },
  });
  
  //auth area
  io.use((socket: CustomSocket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
    throw createHttpError(HttpStatus.UNAUTHORIZED,HttpResponse.UNAUTHORIZED)
    }

    try {
      const user = verifyAccesToken(token);
      if (!user) {
        throw createHttpError(HttpStatus.UNAUTHORIZED,HttpResponse.UNAUTHORIZED)
      }
      socket.data.user = user; 
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket: CustomSocket) => {
    console.log("User Connected ", socket.id);
  const token=socket.handshake.auth.token
  const user=verifyAccesToken(token)
  if(!user){
    throw createHttpError(HttpStatus.UNAUTHORIZED,HttpResponse.UNAUTHORIZED)
  }

    socket.data.userId=user._id 
  
    socket.on("join", (payload) => {
  

      const {chatId}=payload||{}
      if(!chatId){
        socket.emit("error", { message: "chatId required" });
        return
      }
      const chat=await 
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
