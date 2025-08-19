import { ISharedService } from "../interface/ISharedService";
import { getObjectURL, putObjectURl } from "../../config/s3Bucket.config";
import { HttpStatus } from "../../const/http-status";
import { HttpResponse } from "../../const/error-message";
import { createHttpError } from "../../utility/http-error";

export class SharedService implements ISharedService {
  constructor() {}

  createS3PutObjectUrl(
    fileName: string,
    fileType: string,
  ): Promise<{ uploadURL: string; fileURL: string }> {
    let folderName = "";

    if (fileType.startsWith("image/")) {
      folderName = "upload/images";
    } else if (fileType.startsWith("application/pdf")) {
      folderName = "upload/pdf";
    } else {
      folderName = "upload/other";
    }
    return putObjectURl(fileName, folderName, fileType);
  }
  async generatePresignedGetUrl(fileName: string): Promise<string> {
    const getURL = await getObjectURL(fileName);
    if (!getURL) {
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.SERVER_ERROR,
      );
    }
    return getURL;
  }
}
