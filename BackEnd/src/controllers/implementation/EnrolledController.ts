import { Request, Response, NextFunction } from "express";
import { IEnrolledController } from "../interface/IEnrolledController";
import { HttpStatus } from "../../const/http-status";
import { successResponse } from "../../utils/response.util";
import { HttpResponse } from "../../const/error-message";
import { IEnrolledService } from "../../services/interface/IEnrolledService";
import { filter } from "../../types/enrollment.types";

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
      const { lectureId, sessionId } = req.body;

      const progressData = await this._enrolledService.updatedProgress(
        enrolledId,
        lectureId,
        sessionId,
      );
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { progressData }));
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
        .json(successResponse(HttpResponse.OK, { ratingResult }));
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

      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { dashboardData }));
    } catch (error) {
      next(error);
    }
  };
  getGraphOFCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { courseId } = req.params;

      const { filter, startData, endDate } = req.query;

      const chartData = await this._enrolledService.getTrendingCourseGraph(
        courseId,
        filter as filter,
        startData as string,
        endDate as string,
      );

      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { chartData }));
    } catch (error) {
      next(error);
    }
  };
  getMentorDashboardData = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { mentorId } = req.params;

      const dashboardData =
        await this._enrolledService.getMentorDashboardData(mentorId);

      console.info("dash board :", { dashboardData });
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { dashboardData }));
    } catch (error) {
      next(error);
    }
  };
  getmentorRevanue = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { filter, mentorId } = req.query;

      const { courseRevanue, slotRevanue } =
        await this._enrolledService.getRevenueGraph(
          filter as string,
          mentorId as string,
        );

      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { courseRevanue, slotRevanue }));
    } catch (error) {
      next(error);
    }
  };
  getAdminRevanue = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { filter } = req.query;
      const { courseRevanue, slotRevanue, signedUsers } =
        await this._enrolledService.getRevenueGraph(filter as string);
      res.status(HttpStatus.OK).json(
        successResponse(HttpResponse.OK, {
          courseRevanue,
          slotRevanue,
          signedUsers,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
  getLearnerDashboardData = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { learnerId } = req.params;
      const dashboardData =
        await this._enrolledService.learnerDashboardCardData(learnerId);
      res.status(HttpStatus.OK).json(
        successResponse(HttpResponse.OK, {
          dashboardData,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
}
