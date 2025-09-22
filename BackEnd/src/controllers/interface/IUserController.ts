import { Request, Response, NextFunction } from "express";

export interface IUserController {
  fetchProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
  changePassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  updateProfileImage(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  updateUserProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getUserProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
