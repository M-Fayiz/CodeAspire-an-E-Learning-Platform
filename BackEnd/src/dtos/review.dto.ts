import { IReviewModel } from "../models/review.model";
import {
  IReviewDTO,
  IReviewPopulatedDTO,
  IReviewUnpopulatedDTO,
} from "../types/dtos.type/review.dto";
import { Types } from "mongoose";

export function reviewDTO(data: IReviewModel): IReviewUnpopulatedDTO {
  return {
    _id: data._id,
    courseId: data.courseId,
    learnerId: data.learnerId,
    rating: data.rating ? data.rating : null,
    comment: data.comment,
    replies: data.replies
      ? {
          mentorId: data.replies.mentorId as Types.ObjectId,
          comment: data.replies.comment as string,
        }
      : undefined,
  };
}

export function popularedReviewDTO(data: IReviewPopulatedDTO): IReviewDTO {
  return {
    _id: data._id,
    courseId: data.courseId,
    learner: {
      _id: data.learnerId._id,
      name: data.learnerId.name,
      profilePicture: data.learnerId.profilePicture as string,
    },
    rating: data.rating ?? null,
    comment: data.comment,
    replies: data.replies?.mentor
      ? {
          menterId: data.replies.mentor._id as Types.ObjectId,
          name: data.replies.mentor.name,
          profilePicture: data.replies.mentor.profilePicture as string,
        }
      : null,
    createdAt: data.createdAt,
  };
}
