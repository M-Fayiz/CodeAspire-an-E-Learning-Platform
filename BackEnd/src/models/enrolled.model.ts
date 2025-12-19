import mongoose, { Types, Document } from "mongoose";
import { completionStatus, IEnrollement } from "../types/enrollment.types";

import { DbModelName } from "../const/modelName";


export interface IEnrolledModel
  extends Document<Types.ObjectId>,
    Omit<IEnrollement, "_id"> {}

const enrolledSchema = new mongoose.Schema<IEnrolledModel>(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DbModelName.COURSE,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DbModelName.CATEGORY,
    },
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: DbModelName.USER,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DbModelName.USER,
    },
    createdAt: {
      type: Date,
    },
    progress: {
      completedLectures: [{ type: mongoose.Schema.ObjectId }],
      lastAccessedLecture: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
      lastAccessedSession:{
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
      completionPercentage: { type: Number, default: 0 },
    },
    courseStatus:{
      type: String,
      enum:Object.values(completionStatus),
      default:completionStatus.IN_PROGRESS
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const EnrolleModel = mongoose.model<IEnrolledModel>(
  DbModelName.ENROLLMENT,
  enrolledSchema,
);
