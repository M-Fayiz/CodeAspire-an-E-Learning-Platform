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

export interface IProgressTrack {
  _id: Types.ObjectId;
  title: string;
  lectures: {
    _id: Types.ObjectId;
    title: string;
  }[];
}

export interface IEnrolledCoursedetailsDTO extends IEnrolledListDto {
  courseId: Types.ObjectId;
  mentorId: Types.ObjectId;
  learnerId: Types.ObjectId;
  progress: ICourseProgess|null;
}

export interface ILectureProgress {
  _id: string | Types.ObjectId;
  title: string;
}
export interface ISessionProgress {
  _id: string | Types.ObjectId;
  title: string;
  lecture?: ILectureProgress[];
}
