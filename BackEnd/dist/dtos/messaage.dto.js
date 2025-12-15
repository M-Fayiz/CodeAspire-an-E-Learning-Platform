"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDto = MessageDto;
function MessageDto(data) {
    return {
        _id: data._id,
        content: data.content,
        mediaUrl: data.mediaUrl,
        createdAt: data.createdAt,
        status: data.status,
        sender: data.sender,
        chatId: data.chatId,
        type: data.type,
    };
}
