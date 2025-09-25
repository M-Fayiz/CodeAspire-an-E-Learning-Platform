import { Types } from "mongoose";

export interface IReview {
  courseId: Types.ObjectId;
  learnerId: Types.ObjectId;
  rating: number;
  comment?: string;
  replies?: {
    mentorId: Types.ObjectId;
    comment: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
