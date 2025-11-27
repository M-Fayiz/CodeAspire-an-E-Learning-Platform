import { Server, Socket } from "socket.io";
import { ChatService } from "../services/implementation/ChatService";
// import { redisPrefix } from '../const/redisKey'
// import redisClient from '../config/redis.config'
import {
  ChatEmitEvents,
  ChatListenEvents,
} from "../types/socket.type/chatSocket.type";
import { SocketData } from "../types/socket.type/globalSocket.type";
import { HttpResponse } from "../const/error-message";
import { ChatRepository } from "../repository/implementation/ChatRepository";
import { MessageRepository } from "../repository/implementation/MessageRespository";
import { parseObjectId } from "../mongoose/objectId";
import { createHttpError } from "../utils/http-error";
import { HttpStatus } from "../const/http-status";
import { ChatEvents } from "../const/socketEvents";

const chatRepository = new ChatRepository();
const messageRepository = new MessageRepository();
const chatService = new ChatService(chatRepository, messageRepository);

export const registerChatHandler = (
  io: Server,
  socket: Socket<ChatListenEvents, ChatEmitEvents, {}, SocketData>,
) => {
  const userId = socket.data.userId;

  socket.on(ChatEvents.JOIN, async (payload) => {
    const { roomId } = payload || {};

    if (!roomId) {
      socket.emit(ChatEvents.ERROR, { message: HttpResponse.CHAT_ID_Required });
      return;
    }
    const chat = await chatService.findChat(roomId);
    if (!chat) {
      socket.emit(ChatEvents.ERROR, { message: HttpResponse.CHAT_NOT_FOUND });
      return;
    }

    if (!chat.users.map((id) => id.toString()).includes(userId)) {
      socket.emit(ChatEvents.ERROR, { message: HttpResponse.NOT_PERMINTED });
      return;
    }

    socket.join(`chat:${roomId}`);
    await new Promise((r) => setTimeout(r, 100));

    socket.to(`chat:${roomId}`).emit(ChatEvents.NOTIFICATION, { roomId });
  });

  socket.on(ChatEvents.SEND, async (payload, ack) => {
    try {
      const { roomId, content, type = "text", mediaUrl} = payload;
      if (!roomId || (!content && type == "text")) {
        return ack?.({ error: "Invalid payload" });
      }

      const chat = await chatService.findChat(roomId);

      if (!chat || !chat.users.map(String).includes(userId)) {
        return ack?.({ error: "Not a Participant" });
      }

      const room_id = parseObjectId(roomId);
      const user_id = parseObjectId(userId);

      if (!room_id || !user_id) {
        throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
      }

      const messageData = await chatService.createMessage({
        chatId: room_id,
        sender: user_id,
        content,
        type,
        status: "sent",
        mediaUrl,
      });
        let previewMessage = "";

        if (type === "text") {
          previewMessage = content as string;
        } else if (type === "image") {
          previewMessage = "📷 Image";
        } else if (type === "pdf") {
          previewMessage = "📎 File";
        } else if (type === "video") {
          previewMessage = "🎥 Video";
        } else if (type === "audio") {
          previewMessage = "🎵 Audio";
        } else {
          previewMessage = "Message";
        }
       await chatService.updateChat(room_id, {
        latestMessage: previewMessage,
        lastMessageTime: new Date().toISOString(),
      });

      const messageToEmit = {
        _id: messageData._id,
        roomId,
        sender: userId,
        content,
        type,
        mediaUrl,
        status: messageData.status,
        createdAt: messageData.createdAt,
      };

      io.to(`chat:${roomId}`).emit(ChatEvents.NEW_MESSAGE, messageToEmit);
      // ack?.({ success: true, message: messageToEmit, tempId });
    } catch (error) {
      console.error("Error handling SEND event:", error);
      ack({ error: "Server error" });
    }
  });

  socket.on(ChatEvents.DELIVERED, async ({ roomId, messageId }) => {
    const chat = await chatService.findChat(roomId);
    if (!chat || !chat.users.map(String).includes(userId)) return;

    await chatService.updateMessage(messageId, { status: "delivered" });

    io.to(`chat:${roomId}`).emit(ChatEvents.STATUS_UPDARE, {
      messageId,
      status: "delivered",
    });
  });

  socket.on(ChatEvents.READ, async ({ roomId, messageIds }) => {
    await chatService.readMessages(messageIds);
    io.to(`chat:${roomId}`).emit(ChatEvents.DELIVERED, {
      messageIds,
      status: "read",
    });
  });
};
