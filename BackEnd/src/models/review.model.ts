import mongoose, { Document, Types } from "mongoose";
import { IReview } from "../types/review.type";

export interface IReviewModel extends IReview, Document {
  _id: Types.ObjectId;
}

const reviewSchema = new mongoose.Schema<IReviewModel>(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      required: true,
    },
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
        ref: "User",
      },
      comment: String,
    },
  },
  { timestamps: true },
);

const ReviewModel = mongoose.model<IReviewModel>("reviews", reviewSchema);

export default ReviewModel;
