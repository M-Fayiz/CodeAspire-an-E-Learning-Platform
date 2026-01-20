"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotModel = void 0;
const mongoose_1 = require("mongoose");
const chatBot_type_1 = require("../types/chatBot.type");
const modelName_const_1 = require("../const/modelName.const");
const messageSchema = new mongoose_1.Schema({
    role: {
        type: String,
        enum: Object.values(chatBot_type_1.Sender),
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const courseChatSchema = new mongoose_1.Schema({
    learnerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: modelName_const_1.DbModelName.USER,
        required: true,
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: modelName_const_1.DbModelName.COURSE,
        required: true,
    },
    messages: [messageSchema],
}, { timestamps: true });
exports.ChatbotModel = (0, mongoose_1.model)(modelName_const_1.DbModelName.CHAT_BOT, courseChatSchema);
