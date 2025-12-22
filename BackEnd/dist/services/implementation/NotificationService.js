"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const error_message_const_1 = require("../../const/error-message.const");
const http_status_const_1 = require("../../const/http-status.const");
const notification_dto_1 = require("../../dtos/notification.dto");
const objectId_1 = require("../../mongoose/objectId");
const http_error_1 = require("../../utils/http-error");
class NotificationService {
    constructor(_notificationRepository) {
        this._notificationRepository = _notificationRepository;
    }
    async getAllNotification(userId) {
        const user_Id = (0, objectId_1.parseObjectId)(userId);
        if (!user_Id) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_ID);
        }
        const notifyData = await this._notificationRepository.getAllNotificaton(user_Id);
        return notifyData.map((notif) => (0, notification_dto_1.notificationDto)(notif));
    }
    async readNotification(notifyId) {
        const notify_id = (0, objectId_1.parseObjectId)(notifyId);
        if (!notify_id) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_ID);
        }
        const updatedDate = await this._notificationRepository.readNotification(notify_id);
        return updatedDate?._id ? updatedDate?._id : null;
    }
}
exports.NotificationService = NotificationService;
