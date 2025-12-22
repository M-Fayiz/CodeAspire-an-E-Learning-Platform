import { parseObjectId } from "../../mongoose/objectId";
import { IReviewRepository } from "../../repository/interface/IReviewRepository";
import { IReview } from "../../types/review.type";
import { IReviewSevice } from "../interface/IReviewService";
import { createHttpError } from "../../utils/http-error";
import { HttpStatus } from "../../const/http-status.const";
import { HttpResponse } from "../../const/error-message.const";
import {
  IReviewDTO,
  IReviewPopulatedDTO,
} from "../../types/dtos.type/review.dto.types";
import { popularedReviewDTO } from "../../dtos/review.dto";

export class ReviewService implements IReviewSevice {
  constructor(private _reviewRepository: IReviewRepository) {}

  async createReview(
    courseId: string,
    learnerId: string,
    comment: string,
    rating: number,
  ): Promise<IReviewDTO> {
    let course_Id = parseObjectId(courseId);
    let learner_Id = parseObjectId(learnerId);

    if (!course_Id || !learner_Id) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.INVALID_ID);
    }
    const reviewData: IReview = {
      courseId: course_Id,
      learnerId: learner_Id,
      rating,
      comment,
    };
    const createdData = await this._reviewRepository.creeateReview(reviewData);
    if (!createdData) {
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_CREATE_REVIE,
      );
    }
    const getPopulatedREview = await this._reviewRepository.getReview(
      createdData._id,
    );
    if (!getPopulatedREview) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ITEM_NOT_FOUND);
    }
    return popularedReviewDTO({
      ...getPopulatedREview.toObject(),
      learnerId: getPopulatedREview.learnerId,
      replies: getPopulatedREview.replies
        ? { mentor: getPopulatedREview.replies.mentorId }
        : null,
    });
  }
  async getCourseReview(courseId: string): Promise<IReviewDTO[] | null> {
    const course_Id = parseObjectId(courseId);
    if (!course_Id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }

    const reviewdata = await this._reviewRepository.getCourseReview(course_Id);
    if (!reviewdata) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ITEM_NOT_FOUND);
    }

    return reviewdata.map((review) =>
      popularedReviewDTO(review as IReviewPopulatedDTO),
    );
  }
}
