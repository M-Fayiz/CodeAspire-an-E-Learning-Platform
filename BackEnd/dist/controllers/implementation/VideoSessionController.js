"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoSessionController = void 0;
const http_status_1 = require("../../const/http-status");
const error_message_1 = require("../../const/error-message");
const response_util_1 = require("../../utils/response.util");
const socket_utils_1 = require("../../utils/socket.utils");
class VideoSessionController {
    constructor(_slotBookingSevice) {
        this._slotBookingSevice = _slotBookingSevice;
        this.startVideoSession = async (req, res, next) => {
            try {
                const { bookedId } = req.params;
                const { sesionData, createdLearnerNotify, createdMentorNotify } = await this._slotBookingSevice.findBookedSlot(bookedId);
                (0, socket_utils_1.sendNotification)(createdMentorNotify.userId, createdMentorNotify);
                (0, socket_utils_1.sendNotification)(createdLearnerNotify.userId, createdLearnerNotify);
                res
                    .status(http_status_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_1.HttpResponse.OK, { videoSessionData: sesionData }));
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.VideoSessionController = VideoSessionController;
