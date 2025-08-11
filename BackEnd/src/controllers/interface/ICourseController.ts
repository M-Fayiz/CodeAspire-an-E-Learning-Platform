import { NextFunction, Request, Response } from "express";

export interface ICourseCategory {
  addCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  fetchCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMentorDraftedCourseList(req: Request, res: Response, next: NextFunction): Promise<void>;
}
