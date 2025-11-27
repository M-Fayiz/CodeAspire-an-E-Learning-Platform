import {
  IReviewDTO,

} from "../../types/dtos.type/review.dto.types";

export interface IReviewSevice {
  createReview(
    courseId: string,
    learnerId: string,
    comment: string,
    rating: number,
  ): Promise<IReviewDTO>;
  getCourseReview(courseIdl: string): Promise<IReviewDTO[] | null>;
}
