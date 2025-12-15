"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateController = void 0;
const http_status_1 = require("../../const/http-status");
const response_util_1 = require("../../utils/response.util");
const error_message_1 = require("../../const/error-message");
class CertificateController {
    constructor(_certificateService) {
        this._certificateService = _certificateService;
        this.createCertificate = async (req, res, next) => {
            try {
                const { learnerId, courseId, programmTitle } = req.body;
                const createdCertificated = await this._certificateService.createCertificate(learnerId, courseId, programmTitle);
                res.status(http_status_1.HttpStatus.OK).json((0, response_util_1.successResponse)(error_message_1.HttpResponse.OK, { createdCertificated }));
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.CertificateController = CertificateController;
