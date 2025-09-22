import { Request, Response, NextFunction } from "express";
import { IEnrolledController } from "../interface/IEnrolledController";
import { HttpStatus } from "../../const/http-status";
import { successResponse } from "../../utility/response.util";
import { HttpResponse } from "../../const/error-message";
import { IEnrolledService } from "../../services/interface/IEnrolledService";
import logger from "../../config/logger.config";

export class EnrolledController implements IEnrolledController {
  constructor(private _enrolledService: IEnrolledService) {}
  getEnrolledCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { learnerId } = req.params;
      const enrolledCourseData =
        await this._enrolledService.getEnrolledCourses(learnerId);
        console.info('enrolled course ',{enrolledCourseData})
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { enrolledCourseData }));
    } catch (error) {
      next(error);
    }
  };
  getEnrolledDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { enrolledId } = req.params;
      const enrolledDetails =
      await this._enrolledService.getEnrolledCourseDetails(enrolledId);
      
      res
      .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { enrolledDetails }));
    } catch (error) {
      next(error);
    }
  };
  updateProgress =async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
      try {
        const {enrolledId}=req.params
        const {sessionId,lectureId}=req.body
        const progressData=await this._enrolledService.updatedProgress(enrolledId,sessionId,lectureId)
        res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK,progressData))
      } catch (error) {
        next(error)
      }
  }
}
