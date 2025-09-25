import type { IFormCourseDTO } from "./courses.types";

export interface IEnrolledListDto {
  _id: string;
  course: IFormCourseDTO;
  completedPercentage: number;
}

export interface IProgressTrack {
  _id: string;
  title: string;
  lectures: {
    _id: string;
    title: string;
  }[];
}
export interface ICourseProgess {
  completedLectures: string[];
  lastAccessedLecture: string | null;
  completionPercentage: number;
}
export interface IEnrolledCoursedetailsDTO extends IEnrolledListDto {
  courseId: string;
  mentorId: string;
  learnerId: string;
  progress: ICourseProgess;
  rating:number
}
