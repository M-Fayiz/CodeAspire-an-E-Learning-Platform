
import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "../config/env.config";
import { verifyAccesToken } from "../utils/jwt-token.util";
import { createHttpError } from "../utils/http-error";
import { HttpStatus } from "../const/http-status";
import { HttpResponse } from "../const/error-message";

import { ChatRepository } from "../repository/implementation/ChatRepository";
import { MessageRepository } from "../repository/implementation/MessageRespository";
import { ChatService } from "../services/implementation/ChatService";

const chatRepository = new ChatRepository()
const messageRepository= new MessageRepository()
const chatService = new ChatService(chatRepository,messageRepository)


interface CustomSocket extends Socket {
  roomId?: string;
  user?: { _id: string, email: string }
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
      throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.UNAUTHORIZED)
    }

    try {
      const user = verifyAccesToken(token);
      if (!user) {
        throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.UNAUTHORIZED)
      }
      console.log('this is user ', user)
      socket.data.userId = user._id;
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket: CustomSocket) => {
    console.log("User Connected ", socket.id);
    const token = socket.handshake.auth.token
    const user = verifyAccesToken(token)
    if (!user) {
      throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.UNAUTHORIZED)
    }

    socket.data.userId = user._id

    socket.on("join", async (payload) => {


      const { chatId } = payload || {}
      if (!chatId) {
        socket.emit("error", { message: HttpResponse.CHAT_ID_Required });
        return
      }
      const chat = await chatService.findChat(chatId)
      if (!chat) {
        socket.emit("error", { message: HttpResponse.CHAT_NOT_FOUND });
        return;
      }
      const userId = socket.data.userId.toString()
      if (!chat.users.includes(userId)) {
        socket.emit("error", { message: HttpResponse.NOT_PERMINTED });
        return;
      }
      socket.join(`user:${userId}`)
      socket.join(`chat:${userId}`)


      // read message mechanism

      socket.to(`chat:${chatId}`).emit("message_notification", { chatId })

    });

    socket.on('send_message', async (payload, ack) => {
      try {
        const userId = socket.data.userId.toString()
        const { chatId, content, type = 'text', mediaUrl, tempId } = payload
        if (!chatId || (!content && type == 'text')) {
          return ack?.({ error: "Invalid payload" });
        }

        const messageData= await 
      } catch (error) {

      }
    })

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
