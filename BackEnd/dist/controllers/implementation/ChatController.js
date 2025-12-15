"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatCOntroller = void 0;
const axios_1 = require("axios");
const error_message_1 = require("../../const/error-message");
const response_util_1 = require("../../utils/response.util");
class ChatCOntroller {
    constructor(_chatService) {
        this._chatService = _chatService;
        this.getOrCreateChat = async (req, res, next) => {
            try {
                const { senderId, receiverId } = req.body;
                const chatData = await this._chatService.getOrCreateRoom(senderId, receiverId);
                res
                    .status(axios_1.HttpStatusCode.Ok)
                    .json((0, response_util_1.successResponse)(error_message_1.HttpResponse.OK, { chatData }));
            }
            catch (error) {
                next(error);
            }
        };
        this.listUsers = async (req, res, next) => {
            try {
                const { senderId } = req.params;
                const ChatUser = await this._chatService.listUsers(senderId);
                res
                    .status(axios_1.HttpStatusCode.Ok)
                    .json((0, response_util_1.successResponse)(error_message_1.HttpResponse.OK, { ChatUser }));
            }
            catch (error) {
                next(error);
            }
        };
        this.getChatMessages = async (req, res, next) => {
            try {
                const { chatId } = req.params;
                const { limit } = req.query;
                const messages = await this._chatService.getMessages(chatId, Number(limit));
                res
                    .status(axios_1.HttpStatusCode.Ok)
                    .json((0, response_util_1.successResponse)(error_message_1.HttpResponse.OK, { messages }));
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.ChatCOntroller = ChatCOntroller;
