import { Request, Response, NextFunction } from "express";
import { ISharedController } from "../interface/ISharedController";
import { ISharedService } from "../../services/interface/ISharedService";
import { HttpStatus } from "../../const/http-status";
import { successResponse } from "../../utility/response.util";
import { HttpResponse } from "../../const/error-message";


export class SharedController implements ISharedController {
  constructor(private _sharedService: ISharedService) {}

  createS3BucketUplaodURL = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { fileName, type } = req.query;
      if ((fileName as string, type)) {
        const uploadUrls = await this._sharedService.createS3PutObjectUrl(
          fileName as string,
          type as string,
        );
        res.status(HttpStatus.OK).json(
          successResponse(HttpResponse.OK, {
            uploadURL: uploadUrls.uploadURL,
            fileURL: uploadUrls.fileURL,
          }),
        );
      }
    } catch (error) {
      next(error);
    }
  };
  createS3BucketDownloadURL = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { key } = req.query;
      const get_fileURL = await this._sharedService.generatePresignedGetUrl(
        key as string,
      );

      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { get_fileURL }));
    } catch (error) {
      next(error);
    }
  };
}
