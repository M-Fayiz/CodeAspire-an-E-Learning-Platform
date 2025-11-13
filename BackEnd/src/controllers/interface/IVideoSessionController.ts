import { NextFunction, Request, Response } from "express";

export interface IVideoSeesionController {
  startVideoSession(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
