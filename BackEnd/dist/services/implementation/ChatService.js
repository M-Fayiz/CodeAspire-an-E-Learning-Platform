"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const error_message_const_1 = require("../../const/error-message.const");
const http_status_const_1 = require("../../const/http-status.const");
const chat_dto_1 = require("../../dtos/chat.dto");
const messaage_dto_1 = require("../../dtos/messaage.dto");
const objectId_1 = require("../../mongoose/objectId");
const http_error_1 = require("../../utils/http-error");
const participantKey_util_1 = require("../../utils/participantKey.util");
class ChatService {
    constructor(_chatRepository, _messageRepository) {
        this._chatRepository = _chatRepository;
        this._messageRepository = _messageRepository;
    }
    async getOrCreateRoom(senderId, receiverId) {
        const sender_Id = (0, objectId_1.parseObjectId)(senderId);
        const receiver_Id = (0, objectId_1.parseObjectId)(receiverId);
        if (!sender_Id || !receiver_Id) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_ID);
        }
        const participentKey = (0, participantKey_util_1.generateParticipantKey)(senderId, receiverId);
        let chat = await this._chatRepository.getChat(participentKey);
        if (!chat) {
            chat = await this._chatRepository.createChat({
                users: [sender_Id, receiver_Id],
                participantKey: participentKey,
            });
        }
        return (0, chat_dto_1.chatDto)(chat);
    }
    async findChat(chatId) {
        const chat_id = (0, objectId_1.parseObjectId)(chatId);
        if (!chat_id) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_ID);
        }
        const chatData = await this._chatRepository.findChatId(chat_id);
        if (!chatData) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.CHAT_NOT_FOUND);
        }
        return (0, chat_dto_1.chatDto)(chatData);
    }
    async createMessage(data) {
        const createdData = await this._messageRepository.createMessage(data);
        return (0, messaage_dto_1.MessageDto)(createdData);
    }
    async updateChat(chatId, filter) {
        const updateData = await this._chatRepository.updateChat(chatId, filter);
        if (!updateData) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.OK, error_message_const_1.HttpResponse.ITEM_NOT_FOUND);
        }
        return (0, chat_dto_1.chatDto)(updateData);
    }
    async updateMessage(messageId, filter) {
        const message_id = (0, objectId_1.parseObjectId)(messageId);
        if (!message_id) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.INVALID_ID);
        }
        const updatedMessage = await this._messageRepository.updateMessage(message_id, filter);
        if (!updatedMessage) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.ITEM_NOT_FOUND);
        }
        return (0, messaage_dto_1.MessageDto)(updatedMessage);
    }
    async listUsers(senderId) {
        const sender_Id = (0, objectId_1.parseObjectId)(senderId);
        if (!sender_Id) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.INVALID_ID);
        }
        const populatedData = await this._chatRepository.listUsers(sender_Id);
        const filteredData = populatedData?.map((chat) => {
            const otherUsers = chat.users.filter((user) => user._id.toString() !== sender_Id.toString());
            return { ...chat, users: otherUsers };
        });
        return (filteredData?.map((chat) => (0, chat_dto_1.chatListDTO)(chat)) ?? []);
    }
    async getMessages(chatId, limit) {
        const chat_id = (0, objectId_1.parseObjectId)(chatId);
        if (!chat_id) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_ID);
        }
        const messages = await this._messageRepository.getChats(chat_id, limit);
        return (messages || []).map((msg) => (0, messaage_dto_1.MessageDto)(msg));
    }
    async readMessages(messageIds) {
        const message_Ids = messageIds.map((id) => (0, objectId_1.parseObjectId)(id));
        if (!message_Ids) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_ID);
        }
        const updatedData = await this._messageRepository.readMessage(message_Ids);
        if (!updatedData) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.INTERNAL_SERVER_ERROR, error_message_const_1.HttpResponse.SERVER_ERROR);
        }
        return updatedData.map((data) => (0, messaage_dto_1.MessageDto)(data));
    }
    async incrementUnreadMSG(chatId, userId) {
        const user_id = (0, objectId_1.parseObjectId)(userId);
        if (!user_id) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_ID);
        }
        const updatedData = await this._chatRepository.IncrementUnreadMsg(chatId, user_id);
        if (!updatedData) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.INTERNAL_SERVER_ERROR, error_message_const_1.HttpResponse.SERVER_ERROR);
        }
        return (0, chat_dto_1.chatDto)(updatedData);
    }
    async resetUnreadMsg(chatId, userId) {
        const user_id = (0, objectId_1.parseObjectId)(userId);
        const chat_Id = (0, objectId_1.parseObjectId)(chatId);
        if (!user_id || !chat_Id) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_ID);
        }
        const updatedData = await this._chatRepository.resetUnreadMsg(chat_Id, user_id);
        if (!updatedData) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.INTERNAL_SERVER_ERROR, error_message_const_1.HttpResponse.SERVER_ERROR);
        }
        return (0, chat_dto_1.chatDto)(updatedData);
    }
}
exports.ChatService = ChatService;
