import { Types } from "mongoose";
import ReviewModel, { IReviewModel } from "../../models/review.model";
import { IReview } from "../../types/review.type";
import { BaseRepository } from "../baseRepository";
import { IReviewRepository } from "../interface/IReviewRepository";

export class ReviewRepository
  extends BaseRepository<IReviewModel>
  implements IReviewRepository
{
  constructor() {
    super(ReviewModel);
  }
  async creeateReview(revieweData: IReview): Promise<IReviewModel> {
    return await this.create(revieweData);
  }
  async getCourseReview(
    courseId: Types.ObjectId,
  ): Promise<IReviewModel[] | null> {
    return await this.find({ courseId: courseId }, ["learnerId"]);
  }
  async getReview(reviewId: Types.ObjectId): Promise<IReviewModel | null> {
    return await this.findById(reviewId, ["learnerId"]);
  }
}
