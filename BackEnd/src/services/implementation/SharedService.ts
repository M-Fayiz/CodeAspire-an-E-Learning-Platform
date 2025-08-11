import { ISharedService } from "../interface/ISharedService";
import { putObjectURl } from "../../config/s3Bucket.config";

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
}
