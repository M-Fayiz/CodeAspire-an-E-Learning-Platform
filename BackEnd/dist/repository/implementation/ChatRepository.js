"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const chat_model_1 = require("../../models/chat.model");
const baseRepository_1 = require("../baseRepository");
class ChatRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(chat_model_1.ChatModel);
    }
    async createChat(chatData) {
        return await this.create(chatData);
    }
    async getChat(prticipandtKey) {
        return await this.findOne({ participantKey: prticipandtKey });
    }
    async findChatId(chatId) {
        return await this.findById(chatId);
    }
    async updateChat(chatId, filter) {
        return await this.findByIDAndUpdate(chatId, filter);
    }
    async listUsers(senderId) {
        const result = await this.find({ users: senderId }, ["users"]);
        return result;
    }
}
exports.ChatRepository = ChatRepository;
