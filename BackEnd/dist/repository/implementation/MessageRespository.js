"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRepository = void 0;
const message_model_1 = require("../../models/message.model");
const baseRepository_1 = require("../baseRepository");
class MessageRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(message_model_1.MessageModel);
    }
    async createMessage(data) {
        return await this.create(data);
    }
    async updateMessage(messageId, filter) {
        return await this.findByIDAndUpdate(messageId, filter);
    }
    async getChats(chatId) {
        const filter = {
            chatId: chatId,
        };
        return await this.findAll(filter);
    }
    async readMessage(messageIds) {
        return await this.UpdateMany({ _id: { $in: messageIds } }, { $set: { status: "read" } });
    }
}
exports.MessageRepository = MessageRepository;
