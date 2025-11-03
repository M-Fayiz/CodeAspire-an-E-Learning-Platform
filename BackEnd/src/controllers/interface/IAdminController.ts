import { Request, Response, NextFunction } from "express";

export interface IAdminController {
  fetchAllUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
  blockUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  userProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
  approveMentor(req: Request, res: Response, next: NextFunction): Promise<void>;
  getDashboardCardData(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
