import { Types } from "mongoose";
import { IFormCourseDTO } from "./course.dtos.type";

export interface IEnrolledListDto {
  _id: Types.ObjectId;
  course: IFormCourseDTO;
  completedPercentage: number;
}

export interface ICourseProgess {
  completedSessions: Types.ObjectId[];
  completedLectures: Types.ObjectId[];
  lastAccessedLecture: Types.ObjectId | null;
  completionPercentage: number;
}
export interface IEnrolledCoursedetailsDTO extends IEnrolledListDto {
  courseId: Types.ObjectId;
  mentorId: Types.ObjectId;
  learnerId: Types.ObjectId;
  progress: ICourseProgess;
}
