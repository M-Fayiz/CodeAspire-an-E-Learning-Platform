"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatDto = chatDto;
exports.chatListDTO = chatListDTO;
function chatDto(data) {
    return {
        _id: data._id,
        participantKey: data.participantKey,
        users: data.users,
        latestMessage: data.latestMessage ?? null,
        lastMessageTime: data.lastMessageTime,
        createdAt: data.createdAt,
    };
}
function chatListDTO(data) {
    return {
        _id: data._id,
        latestMessage: data.latestMessage,
        participantKey: data.participantKey,
        user: {
            _id: data.users[0]._id,
            name: data.users[0].name,
            profile: data.users[0].profilePicture,
        },
        lastMessageTime: data.lastMessageTime,
        createdAt: data.createdAt,
    };
}
