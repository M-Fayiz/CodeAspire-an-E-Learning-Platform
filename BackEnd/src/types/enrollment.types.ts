import { Types } from "mongoose";
import { IFormCourseDTO } from "./dtos.type/course.dtos.type";

export interface IProgressTrack {
  completedLectures: Types.ObjectId[];
  lastAccessedLecture: Types.ObjectId | null;
  completionPercentage: number;
}

export interface IEnrolledAggregation {
  avgRating: number;
  totalStudents: number;
}
export enum completionStatus {
  IN_PROGRESS = "inProgress",
  COMPLETED = "completed",
}

export interface IEnrollement {
  learnerId: Types.ObjectId;
  courseId: Types.ObjectId | IFormCourseDTO;
  mentorId: Types.ObjectId;
  categoryId: Types.ObjectId;
  progress: {
    completedLectures: Types.ObjectId[];
    lastAccessedLecture: Types.ObjectId | null;
    lastAccessedSession: Types.ObjectId | null;
    completionPercentage: number;
  };
  courseStatus: completionStatus;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type filter = "today" | "Last Week" | "Last Month" | "Custom";

export interface chartFilter {
  courseId: Types.ObjectId;
  start: Date;
  end: Date;
}

export interface chartAggregation {
  _id: {
    day: Date;
  };
  count: number;
}
