import mongoose, { Document, Types } from "mongoose";
import { IReview } from "../types/review.type";
import { DbModelName } from "../const/modelName";

export interface IReviewModel extends IReview, Document {
  _id: Types.ObjectId;
}

const reviewSchema = new mongoose.Schema<IReviewModel>(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DbModelName.COURSE,
      required: true,
    },
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DbModelName.USER,
      required: true,
    },
    comment: {
      type: String,
      required: false,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    replies: {
      mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DbModelName.USER,
      },
      comment: String,
    },
  },
  { timestamps: true },
);

const ReviewModel = mongoose.model<IReviewModel>(
  DbModelName.REVIEW,
  reviewSchema,
);

export default ReviewModel;
