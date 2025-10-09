import { Request, Response, NextFunction } from "express";

export interface INotificationController {
  getAllNotification(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  readNotification(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
