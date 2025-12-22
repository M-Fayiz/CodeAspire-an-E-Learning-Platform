"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerChatHandler = void 0;
const ChatService_1 = require("../services/implementation/ChatService");
const error_message_const_1 = require("../const/error-message.const");
const ChatRepository_1 = require("../repository/implementation/ChatRepository");
const MessageRespository_1 = require("../repository/implementation/MessageRespository");
const objectId_1 = require("../mongoose/objectId");
const http_error_1 = require("../utils/http-error");
const http_status_const_1 = require("../const/http-status.const");
const socketEvents_const_1 = require("../const/socketEvents.const");
const chatRepository = new ChatRepository_1.ChatRepository();
const messageRepository = new MessageRespository_1.MessageRepository();
const chatService = new ChatService_1.ChatService(chatRepository, messageRepository);
const registerChatHandler = (io, socket) => {
    const userId = socket.data.userId;
    socket.on(socketEvents_const_1.ChatEvents.JOIN, async (payload) => {
        const { roomId } = payload || {};
        if (!roomId) {
            socket.emit(socketEvents_const_1.ChatEvents.ERROR, { message: error_message_const_1.HttpResponse.CHAT_ID_Required });
            return;
        }
        const chat = await chatService.findChat(roomId);
        if (!chat) {
            socket.emit(socketEvents_const_1.ChatEvents.ERROR, { message: error_message_const_1.HttpResponse.CHAT_NOT_FOUND });
            return;
        }
        if (!chat.users.map((id) => id.toString()).includes(userId)) {
            socket.emit(socketEvents_const_1.ChatEvents.ERROR, { message: error_message_const_1.HttpResponse.NOT_PERMINTED });
            return;
        }
        socket.join(`chat:${roomId}`);
        await new Promise((r) => setTimeout(r, 100));
        socket.to(`chat:${roomId}`).emit(socketEvents_const_1.ChatEvents.NOTIFICATION, { roomId });
    });
    socket.on(socketEvents_const_1.ChatEvents.SEND, async (payload, ack) => {
        try {
            const { roomId, content, type = "text", mediaUrl } = payload;
            if (!roomId || (!content && type == "text")) {
                return ack?.({ error: "Invalid payload" });
            }
            const chat = await chatService.findChat(roomId);
            if (!chat || !chat.users.map(String).includes(userId)) {
                return ack?.({ error: "Not a Participant" });
            }
            const room_id = (0, objectId_1.parseObjectId)(roomId);
            const user_id = (0, objectId_1.parseObjectId)(userId);
            if (!room_id || !user_id) {
                throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_ID);
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
                previewMessage = content;
            }
            else if (type === "image") {
                previewMessage = "📷 Image";
            }
            else if (type === "pdf") {
                previewMessage = "📎 File";
            }
            else if (type === "video") {
                previewMessage = "🎥 Video";
            }
            else if (type === "audio") {
                previewMessage = "🎵 Audio";
            }
            else {
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
            io.to(`chat:${roomId}`).emit(socketEvents_const_1.ChatEvents.NEW_MESSAGE, messageToEmit);
            // ack?.({ success: true, message: messageToEmit, tempId });
        }
        catch (error) {
            console.error("Error handling SEND event:", error);
        }
    });
    socket.on(socketEvents_const_1.ChatEvents.DELIVERED, async ({ roomId, messageId }) => {
        const chat = await chatService.findChat(roomId);
        if (!chat || !chat.users.map(String).includes(userId))
            return;
        await chatService.updateMessage(messageId, { status: "delivered" });
        io.to(`chat:${roomId}`).emit(socketEvents_const_1.ChatEvents.STATUS_UPDARE, {
            messageId,
            status: "delivered",
        });
    });
    socket.on(socketEvents_const_1.ChatEvents.READ, async ({ roomId, messageIds }) => {
        await chatService.readMessages(messageIds);
        io.to(`chat:${roomId}`).emit(socketEvents_const_1.ChatEvents.DELIVERED, {
            messageIds,
            status: "read",
        });
    });
};
exports.registerChatHandler = registerChatHandler;
