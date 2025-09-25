import { Request, Response, NextFunction } from "express";

export interface IEnrolledController {
  getEnrolledCourse(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getEnrolledDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  updateProgress(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  addRating(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCourseDashboardData(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
