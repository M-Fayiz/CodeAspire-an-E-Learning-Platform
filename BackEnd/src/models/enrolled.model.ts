import mongoose, { Types, Document } from "mongoose";
import { IEnrollement } from "../types/enrollment.types";
import { Schema } from "zod";

export interface IEnrolledModel
  extends Document<Types.ObjectId>,
    Omit<IEnrollement, "_id"> {}

const enrolledSchema = new mongoose.Schema<IEnrolledModel>({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses",
    required: true,
  },
  learnerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
  },
  progress: {
    completedLectures:[{type:mongoose.Schema.ObjectId}],
    lastAccessedLectures: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    completionPercentage: { type: Number, default: 0 },
  },
});

export const EnrolleModel = mongoose.model<IEnrolledModel>(
  "enrolles",
  enrolledSchema,
);
