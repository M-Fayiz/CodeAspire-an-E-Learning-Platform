"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedService = void 0;
const s3Bucket_config_1 = require("../../config/s3Bucket.config");
const http_status_1 = require("../../const/http-status");
const error_message_1 = require("../../const/error-message");
const http_error_1 = require("../../utils/http-error");
class SharedService {
    constructor() { }
    createS3PutObjectUrl(fileName, fileType) {
        let folderName = "";
        if (fileType.startsWith("image/")) {
            folderName = "upload/images";
        }
        else if (fileType.startsWith("application/pdf")) {
            folderName = "upload/pdf";
        }
        else {
            folderName = "upload/other";
        }
        return (0, s3Bucket_config_1.putObjectURl)(fileName, folderName, fileType);
    }
    async generatePresignedGetUrl(fileName) {
        if (!fileName) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.BAD_REQUEST, error_message_1.HttpResponse.ITEM_NOT_FOUND);
        }
        const getURL = await (0, s3Bucket_config_1.getObjectURL)(fileName);
        if (!getURL) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.INTERNAL_SERVER_ERROR, error_message_1.HttpResponse.SERVER_ERROR);
        }
        return getURL;
    }
}
exports.SharedService = SharedService;
