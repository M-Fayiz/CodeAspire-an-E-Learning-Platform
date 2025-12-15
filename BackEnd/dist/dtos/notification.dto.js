"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationDto = notificationDto;
function notificationDto(data) {
    return {
        _id: data._id,
        title: data.title,
        message: data.message,
        isRead: data.isRead,
        type: data.type,
        userId: data.userId,
        createdAt: data.createdAt,
        link: data.link,
    };
}
