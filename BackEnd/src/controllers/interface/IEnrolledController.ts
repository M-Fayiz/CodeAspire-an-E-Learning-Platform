import { Request, Response, NextFunction } from "express";

export interface IEnrolledController {
  getEnrolledCourse(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
