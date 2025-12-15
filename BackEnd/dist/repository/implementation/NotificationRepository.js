"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const baseRepository_1 = require("../baseRepository");
const notification_model_1 = require("../../models/notification.model");
class NotificationRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(notification_model_1.NotificationModel);
    }
    async createNotification(notificationData) {
        return await this.create(notificationData);
    }
    async getAllNotificaton(userId) {
        return await this.findAll({ userId: userId });
    }
    async readNotification(notifyId) {
        return await this.findByIDAndUpdate(notifyId, { isRead: true });
    }
}
exports.NotificationRepository = NotificationRepository;
