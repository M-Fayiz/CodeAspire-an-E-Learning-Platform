import { Types } from "mongoose";
import { IUser } from "../user.types";
import { IReviewModel } from "../../models/review.model";

export interface IReviewDTO {
  _id: Types.ObjectId;
  courseId: Types.ObjectId;
  learner: {
    _id: Types.ObjectId;
    name: string;
    profilePicture: string;
  };
  rating: number | null;
  comment: string;
  replies?: {
    menterId: Types.ObjectId;
    name: string;
    profilePicture: string;
  } | null;
}

export interface IReviewUnpopulatedDTO {
  _id: Types.ObjectId;
  courseId: Types.ObjectId;
  learnerId: Types.ObjectId;
  rating?: number | null;
  comment?: string;
  replies?: {
    mentorId: Types.ObjectId;
    comment?: string;
  };
}

export interface IReviewPopulatedDTO {
  _id: Types.ObjectId;
  courseId: Types.ObjectId;
  learnerId: IUser;
  rating: number;
  comment: string;
  replies?: {
    mentor: IUser;
  };
}
