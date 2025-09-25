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

export interface IEnrollement {
  learnerId: Types.ObjectId;
  courseId: Types.ObjectId | IFormCourseDTO;
  mentorId: Types.ObjectId;
  progress: {
    completedLectures: Types.ObjectId[];
    lastAccessedLecture: Types.ObjectId | null;
    completionPercentage: number;
  };
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
