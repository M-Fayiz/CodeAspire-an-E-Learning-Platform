"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotRepository = void 0;
const chatbot_model_1 = require("../../models/chatbot.model");
const baseRepository_1 = require("../baseRepository");
class ChatbotRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(chatbot_model_1.ChatbotModel);
    }
    async createChat(chatData) {
        return await this.create(chatData);
    }
    async findChat(filter) {
        return await this.findOne(filter);
    }
    async updateChatbot(chatId, updateDate) {
        return await this.findByIDAndUpdate(chatId, updateDate);
    }
}
exports.ChatbotRepository = ChatbotRepository;
