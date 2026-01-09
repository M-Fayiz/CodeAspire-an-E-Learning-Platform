import { Types } from "mongoose";
import { completionStatus } from "./enrollment.types";
import { ICourses } from "./courses.type";

export interface LearnerCourseCard {
  courseCount: number;
  completedCourse: number;
  inProgressCourse: number;
}

export interface LearnerSlotCard {
  totalSession: number;
  totalCracked: number;
  totalFailed: number;
}

export interface InProgressCourse {
  _id: Types.ObjectId;
  progress: {
    completedLectures: Types.ObjectId[];
    lastAccessedLecture: Types.ObjectId | null;
    lastAccessedSession: Types.ObjectId | null;
    completionPercentage: number;
  };
  courseStatus: completionStatus;
  courseId: ICourses;
}
