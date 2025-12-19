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
  getGraphOFCourse(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getMentorDashboardData(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getmentorRevanue(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getAdminRevanue(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getLearnerDashboardData(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
