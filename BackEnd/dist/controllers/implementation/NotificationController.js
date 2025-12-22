"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const error_message_const_1 = require("../../const/error-message.const");
const http_status_const_1 = require("../../const/http-status.const");
const response_util_1 = require("../../utils/response.util");
class NotificationController {
    constructor(_notificationService) {
        this._notificationService = _notificationService;
        this.getAllNotification = async (req, res, next) => {
            try {
                const { userId } = req.params;
                const notificationData = await this._notificationService.getAllNotification(userId);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { notificationData }));
            }
            catch (error) {
                next(error);
            }
        };
        this.readNotification = async (req, res, next) => {
            try {
                const { notifyId } = req.params;
                const readID = await this._notificationService.readNotification(notifyId);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { readID }));
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.NotificationController = NotificationController;
