import { Request, Response, NextFunction } from "express";

export interface IAuthController {
  signUp(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void>;
  authMe(req: Request, res: Response, next: NextFunction): Promise<void>;
  refreshToken(req: Request, res: Response, next: NextFunction): Promise<void>;
  logout(req: Request, res: Response, next: NextFunction): Promise<void>;
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  googleAuthRedirection(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
