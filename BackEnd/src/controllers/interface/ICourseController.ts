import { NextFunction, Request, Response } from "express";

export interface ICourseController {
  addCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  fetchCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMentorDraftedCourseList(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  addSession(req: Request, res: Response, next: NextFunction): Promise<void>;
  addLecture(req: Request, res: Response, next: NextFunction): Promise<void>;
  editLecture(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateBaseInfo(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
