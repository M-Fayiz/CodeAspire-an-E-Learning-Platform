"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateController = void 0;
const http_status_const_1 = require("../../const/http-status.const");
const response_util_1 = require("../../utils/response.util");
const error_message_const_1 = require("../../const/error-message.const");
const socket_utils_1 = require("../../utils/socket.utils");
class CertificateController {
    constructor(_certificateService) {
        this._certificateService = _certificateService;
        this.createCertificate = async (req, res, next) => {
            try {
                const { learnerId, courseId, programmTitle } = req.body;
                const { certificate, notification } = await this._certificateService.createCertificate(learnerId, courseId, programmTitle);
                (0, socket_utils_1.sendNotification)(notification.userId, notification);
                console.log("cer :  ", certificate);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { certificate }));
            }
            catch (error) {
                next(error);
            }
        };
        this.listCertificate = async (req, res, next) => {
            try {
                const { learnerId } = req.params;
                const certificate = await this._certificateService.listCertificate(learnerId);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { certificate }));
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.CertificateController = CertificateController;
