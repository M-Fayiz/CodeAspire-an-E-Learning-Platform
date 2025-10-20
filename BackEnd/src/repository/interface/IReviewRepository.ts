import { Types } from "mongoose";
import { IReviewModel } from "../../models/review.model";
import { IReview } from "../../types/review.type";
import { IReviewPopulatedDTO } from "../../types/dtos.type/review.dto.types";

export interface IReviewRepository {
  creeateReview(revieweData: IReview): Promise<IReviewModel>;
  getCourseReview(
    courseId: Types.ObjectId,
  ): Promise<IReviewPopulatedDTO[] | null>;
  getReview(reviewId: Types.ObjectId): Promise<IReviewModel | null>;
}
