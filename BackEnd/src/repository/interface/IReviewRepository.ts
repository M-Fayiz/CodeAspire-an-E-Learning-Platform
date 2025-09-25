import { Types } from "mongoose";
import { IReviewModel } from "../../models/review.model";
import { IReview } from "../../types/review.type";

export interface IReviewRepository {
  creeateReview(revieweData: IReview): Promise<IReviewModel>;
  getCourseReview(courseId: Types.ObjectId): Promise<IReviewModel[] | null>;
  getReview(reviewId: Types.ObjectId): Promise<IReviewModel | null>;
}
