import { NextFunction, Request, Response } from "express";

export interface ICertificateController {
  createCertificate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
