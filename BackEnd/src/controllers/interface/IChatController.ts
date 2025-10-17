import { NextFunction, Request, Response } from "express";

export interface IChatController {
  getOrCreateChat(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  listUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
  getChatMessages(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
