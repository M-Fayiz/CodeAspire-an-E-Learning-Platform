import type { IFormCourseDTO } from "./courses.types";

export interface IEnrolledListDto {
  _id: string;
  course: IFormCourseDTO;
  completedPercentage: number;
}

export interface ICourseProgess {
  progressTrack: ISession[];
    lastAccessedLecture: string | null;
    completionPercentage: number;
}
export interface IEnrolledCoursedetailsDTO extends IEnrolledListDto {
  courseId: string;
  mentorId: string;
  learnerId: string;
  progress: ICourseProgess;
}
