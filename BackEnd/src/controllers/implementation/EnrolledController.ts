import { Request, Response, NextFunction } from "express";
import { IEnrolledController } from "../interface/IEnrolledController";
import { HttpStatus } from "../../const/http-status";
import { successResponse } from "../../utility/response.util";
import { HttpResponse } from "../../const/error-message";
import { IEnrolledService } from "../../services/interface/IEnrolledService";

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
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { enrolledCourseData }));
    } catch (error) {
      next(error);
    }
  };
}
