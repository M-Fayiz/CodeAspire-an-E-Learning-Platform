import { Request, Response, NextFunction } from "express";
import { IReviewController } from "../interface/IReviewController";
import { IReviewSevice } from "../../services/interface/IReviewService";
import { HttpStatus } from "../../const/http-status";
import { HttpResponse } from "../../const/error-message";
import { successResponse } from "../../utils/response.util";

export class ReviewController implements IReviewController {
  constructor(private _reviewService: IReviewSevice) {}
  createReview = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { courseId, learnerId, comment, rating } = req.body;
      console.warn(req.body);
      const ceratedReview = await this._reviewService.createReview(
        courseId,
        learnerId,
        comment,
        rating,
      );

      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { ceratedReview }));
    } catch (error) {
      next(error);
    }
  };
  getCourseReview = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      const courseReview = await this._reviewService.getCourseReview(courseId);
      console.log(courseReview);
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { courseReview }));
    } catch (error) {
      next(error);
    }
  };
}
