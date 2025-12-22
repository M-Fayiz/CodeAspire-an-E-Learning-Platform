import { HttpResponse } from "../../const/error-message.const";
import { HttpStatus } from "../../const/http-status.const";
import { INotificationService } from "../../services/interface/INotificationService";
import { successResponse } from "../../utils/response.util";
import { INotificationController } from "../interface/INotificationController";
import { Request, Response, NextFunction } from "express";

export class NotificationController implements INotificationController {
  constructor(private _notificationService: INotificationService) {}
  getAllNotification = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      const notificationData =
        await this._notificationService.getAllNotification(userId);

      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { notificationData }));
    } catch (error) {
      next(error);
    }
  };
  readNotification = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { notifyId } = req.params;
      const readID = await this._notificationService.readNotification(notifyId);
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { readID }));
    } catch (error) {
      next(error);
    }
  };
}
