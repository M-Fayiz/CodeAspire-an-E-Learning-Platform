export interface ISharedService {
  createS3PutObjectUrl(
    fileName: string,
    fileType: string,
  ): Promise<{ uploadURL: string; fileURL: string }>;
  generatePresignedGetUrl(fileName: string): Promise<string>;
}
