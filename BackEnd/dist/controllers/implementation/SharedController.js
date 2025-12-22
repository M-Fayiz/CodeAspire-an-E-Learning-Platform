"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedController = void 0;
const http_status_const_1 = require("../../const/http-status.const");
const response_util_1 = require("../../utils/response.util");
const error_message_const_1 = require("../../const/error-message.const");
class SharedController {
    constructor(_sharedService) {
        this._sharedService = _sharedService;
        this.createS3BucketUplaodURL = async (req, res, next) => {
            try {
                const { fileName, type } = req.query;
                if ((fileName, type)) {
                    const uploadUrls = await this._sharedService.createS3PutObjectUrl(fileName, type);
                    res.status(http_status_const_1.HttpStatus.OK).json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, {
                        uploadURL: uploadUrls.uploadURL,
                        fileURL: uploadUrls.fileURL,
                    }));
                }
            }
            catch (error) {
                next(error);
            }
        };
        this.createS3BucketDownloadURL = async (req, res, next) => {
            try {
                const { key } = req.query;
                console.log("key if aws file ", key);
                const get_fileURL = await this._sharedService.generatePresignedGetUrl(key);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { get_fileURL }));
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.SharedController = SharedController;
