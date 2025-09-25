import { Request, Response, NextFunction } from "express";
import { IEnrolledController } from "../interface/IEnrolledController";
import { HttpStatus } from "../../const/http-status";
import { successResponse } from "../../utility/response.util";
import { HttpResponse } from "../../const/error-message";
import { IEnrolledService } from "../../services/interface/IEnrolledService";
import logger from "../../config/logger.config";
import { AxiosHeaders } from "axios";

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
      console.info("enrolled course ", { enrolledCourseData });
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
  updateProgress = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { enrolledId } = req.params;
      const { lectureId } = req.body;
      console.log(lectureId);
      const progressData = await this._enrolledService.updatedProgress(
        enrolledId,
        lectureId,
      );
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, progressData));
    } catch (error) {
      next(error);
    }
  };
  addRating = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { enrolledId } = req.params;
      const { value } = req.body;
      const ratingResult = await this._enrolledService.addRating(
        enrolledId,
        value,
      );
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, ratingResult));
    } catch (error) {
      next(error);
    }
  };
  getCourseDashboardData = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { courseId, mentorId } = req.params;

      const dashboardData =
        await this._enrolledService.getCourseEnrolledDashboardData(
          courseId,
          mentorId,
        );
      res.status(200).json(successResponse(HttpResponse.OK, { dashboardData }));
    } catch (error) {
      next(error);
    }
  };
}
