import { Request, Response, NextFunction } from "express";
import { ICertificateController } from "../interface/ICertificateController";
import { HttpStatus } from "../../const/http-status";
import { successResponse } from "../../utils/response.util";
import { HttpResponse } from "../../const/error-message";
import { ICertificateService } from "../../services/interface/ICertificateService";
import { sendNotification } from "../../utils/socket.utils";

export class CertificateController implements ICertificateController {
  constructor(private _certificateService: ICertificateService) {}

  createCertificate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { learnerId, courseId ,programmTitle} = req.body;

      const {certificate,notification} =
        await this._certificateService.createCertificate(learnerId, courseId,programmTitle);
      sendNotification(notification.userId ,notification)

      console.log('cer :  ',certificate)
      res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK,{certificate}));
    } catch (error) {
      next(error);
    }
  }
  listCertificate=async(req: Request, res: Response, next: NextFunction): Promise<void>=>{
    try {
      const {learnerId}=req.params
      const certificate=await this._certificateService.listCertificate(learnerId)
      res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK,{certificate}));
    } catch (error) {
      next(error)
    }
  }

}
