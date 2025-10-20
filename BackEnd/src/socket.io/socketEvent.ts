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
import redisClient from "../config/redis.config";
import { redisPrefix } from "../const/redisKey";

const chatRepository = new ChatRepository();
const messageRepository = new MessageRepository();
const chatService = new ChatService(chatRepository, messageRepository);

interface CustomSocket extends Socket {
  roomId?: string;
  user?: { _id: string; email: string };
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
      throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.UNAUTHORIZED);
    }

    try {
      const user = verifyAccesToken(token);
      if (!user) {
        throw createHttpError(
          HttpStatus.UNAUTHORIZED,
          HttpResponse.UNAUTHORIZED,
        );
      }

      socket.data.userId = user._id;
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", async (socket: CustomSocket) => {
    console.log("User Connected ", socket.id);

    const userId = socket.data.userId;
    socket.join(`user:${userId}`);

    await redisClient.hSet(redisPrefix.ONLINE_USERS, userId, socket.id);

    io.emit("user:online", userId);

    socket.on("join_chat", async (payload) => {
      const { roomId } = payload || {};
      console.log("room id ", roomId);
      if (!roomId) {
        socket.emit("error", { message: HttpResponse.CHAT_ID_Required });
        return;
      }
      const chat = await chatService.findChat(roomId);
      if (!chat) {
        socket.emit("error", { message: HttpResponse.CHAT_NOT_FOUND });
        return;
      }

      const userId = socket.data.userId.toString();
      if (!chat.users.map((id) => id.toString()).includes(userId)) {
        socket.emit("error", { message: HttpResponse.NOT_PERMINTED });
        return;
      }

      socket.join(`chat:${roomId}`);
      await new Promise((r) => setTimeout(r, 100));

      socket.to(`chat:${roomId}`).emit("message_notification", { roomId });
    });

    socket.on("send_message", async (payload, ack) => {
      try {
        const userId = socket.data.userId.toString();

        const { roomId, content, type = "text", mediaUrl, tempId } = payload;
        if (!roomId || (!content && type == "text")) {
          return ack?.({ error: "Invalid payload" });
        }

        const chat = await chatService.findChat(roomId);

        if (!chat || !chat.users.map(String).includes(userId)) {
          return ack?.({ error: "Not a Participant" });
        }

        const messageData = await chatService.createMessage({
          chatId: roomId,
          sender: userId,
          content,
          type,
          status: "sent",
          mediaUrl,
        });

        const updatedChat = await chatService.updateChat(roomId, {
          latestMessage: messageData._id,
          lastMessageTime: new Date().toISOString(),
        });

        const messageToEmit = {
          _id: messageData._id,
          roomId,
          sender: userId,
          content,
          type,
          status: messageData.status,
          createdAt: messageData.createdAt,
        };

        io.to(`chat:${roomId}`).emit("new_message", messageToEmit);
        ack?.({ success: true, message: messageToEmit, tempId });
      } catch (error) {
        ack({ error: "server error" });
      }
    });

    socket.on("message_delivered", async ({ roomId, messageId }) => {
      const userId = socket.data.userId.toString();
      const chat = await chatService.findChat(roomId);
      if (!chat || !chat.users.map(String).includes(userId)) return;

      await chatService.updateMessage(messageId, { status: "delivered" });

      io.to(`chat:${roomId}`).emit("message_status_update", {
        messageId,
        status: "delivered",
      });
    });

    socket.on("message_read", async ({ roomId, messageIds }) => {
      const userId = socket.data.userId.toString();

      const chatMessage = await chatService.readMessages(messageIds);
      io.to(`chat:${roomId}`).emit("message_status_update", {
        messageIds,
        status: "read",
      });
    });

    socket.on("disconnect", async () => {
      await redisClient.hDel(redisPrefix.ONLINE_USERS, userId);
      io.emit("user:offline", userId);
    });
  });
  return io;
};
export const getIO = (): Server => {
  if (!io) throw new Error("Socket.io not initialized yet");
  return io;
};
