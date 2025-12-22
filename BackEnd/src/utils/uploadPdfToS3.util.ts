import fs from "fs";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Bucket } from "../config/s3Bucket.config";
import { env } from "../config/env.config";

const bucketName = env.AWS_s3_BUCKET_NAME as string;

export async function uploadPdfToS3(localPath: string, fileName: string) {
  const fileStream = fs.createReadStream(localPath);

  const key = `certificates/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileStream,
    ContentType: "application/pdf",
  });

  await s3Bucket.send(command);

  return key;
}

export async function uploadImageToS3(localPath: string, fileName: string) {
  const fileStream = fs.createReadStream(localPath);

  const key = `preview-image/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileStream,
    ContentType: "preview/images",
  });

  await s3Bucket.send(command);

  return key;
}
