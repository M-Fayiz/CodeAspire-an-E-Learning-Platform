import { Request, Response, NextFunction } from "express";
import { ICertificateController } from "../interface/ICertificateController";
import { HttpStatus } from "../../const/http-status";
import { successResponse } from "../../utils/response.util";
import { HttpResponse } from "../../const/error-message";
import { ICertificateService } from "../../services/interface/ICertificateService";

export class CertificateController implements ICertificateController {
  constructor(private _certificateService: ICertificateService) {}

  createCertificate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { learnerId, courseId } = req.body;

      const createdCertificated =
        await this._certificateService.createCertificate(learnerId, courseId);

      res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK));
    } catch (error) {
      next(error);
    }
  };
}
