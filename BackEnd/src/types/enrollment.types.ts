import { Types } from "mongoose";
import { IFormCourseDTO } from "./dtos.type/course.dtos.type";

export interface IEnrollement {
  learnerId: Types.ObjectId;
  courseId: Types.ObjectId | IFormCourseDTO;
  mentorId: Types.ObjectId;
  progress: {
    completedSessions: Types.ObjectId[];
    completedLectures: Types.ObjectId[];
    lastAccessedLecture: Types.ObjectId | null;
    completionPercentage: number;
  };
  createdAt?: Date;
}
