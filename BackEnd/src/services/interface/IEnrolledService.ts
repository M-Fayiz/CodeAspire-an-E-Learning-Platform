import {
  ICourseProgess,
  IEnrolledCoursedetailsDTO,
  IEnrolledListDto,
  ILectureProgress,
  ISessionProgress,
} from "../../types/dtos.type/enrolled.dto.type";
import { IProgressTrack } from "../../types/enrollment.types";

export interface IEnrolledService {
  getEnrolledCourses(learnerId: string): Promise<IEnrolledListDto[]>;
  getEnrolledCourseDetails(
    enrolledId: string,
  ): Promise<IEnrolledCoursedetailsDTO | null>;
  updatedProgress(
    enroledId: string,
    lecture: string,
  ): Promise<IProgressTrack | null>;
}
