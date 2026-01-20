"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatbotDTO = chatbotDTO;
function chatbotDTO(chat) {
    return {
        _id: chat._id,
        learnerId: chat.learnerId,
        courseId: chat.courseId,
        messages: chat.messages,
    };
}
