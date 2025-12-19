"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPdfToS3 = uploadPdfToS3;
exports.uploadImageToS3 = uploadImageToS3;
const fs_1 = __importDefault(require("fs"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3Bucket_config_1 = require("../config/s3Bucket.config");
const env_config_1 = require("../config/env.config");
const bucketName = env_config_1.env.AWS_s3_BUCKET_NAME;
async function uploadPdfToS3(localPath, fileName) {
    const fileStream = fs_1.default.createReadStream(localPath);
    const key = `certificates/${fileName}`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: fileStream,
        ContentType: "application/pdf",
    });
    await s3Bucket_config_1.s3Bucket.send(command);
    return key;
}
async function uploadImageToS3(localPath, fileName) {
    const fileStream = fs_1.default.createReadStream(localPath);
    const key = `preview-image/${fileName}`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: fileStream,
        ContentType: "preview/images",
    });
    await s3Bucket_config_1.s3Bucket.send(command);
    return key;
}
