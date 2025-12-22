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
  getAdminCoursList(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getCourseDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  approveCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  rejectCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  publishCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCourseListSlot(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getCourseFormData(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  removeSession(req: Request, res: Response, next: NextFunction): Promise<void>;
}
