"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Bucket = void 0;
exports.getObjectURL = getObjectURL;
exports.putObjectURl = putObjectURl;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const env_config_1 = require("./env.config");
const region = env_config_1.env.AWS_S3_REGION;
const accessKeyID = env_config_1.env.AWS_S3_ACCESS_KEY;
const secreteAccessKey = env_config_1.env.AWS_S3_SECRET_KEY;
const bucketName = env_config_1.env.AWS_s3_BUCKET_NAME;
exports.s3Bucket = new client_s3_1.S3Client({
    region: region,
    credentials: {
        accessKeyId: accessKeyID,
        secretAccessKey: secreteAccessKey,
    },
});
async function getObjectURL(key) {
    const command = new client_s3_1.GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });
    const url = await (0, s3_request_presigner_1.getSignedUrl)(exports.s3Bucket, command, {
        expiresIn: 60,
    });
    return url;
}
async function putObjectURl(filename, folderName, fileType) {
    const key = `${folderName}/${Date.now()}-${filename}`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: fileType,
    });
    const uploadURL = await (0, s3_request_presigner_1.getSignedUrl)(exports.s3Bucket, command);
    const fileURL = key;
    return { uploadURL, fileURL };
}
