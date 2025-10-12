import {
  CourseDashboardDTO,
  IChartTrendDTO,
} from "../../types/dtos.type/courseDashboard.dto.type";
import {
  IEnrolledCoursedetailsDTO,
  IEnrolledListDto,
} from "../../types/dtos.type/enrolled.dto.type";
import { IMentorDhasboardDTO } from "../../types/dtos.type/mentorDashboard.dto.type";
import { filter, IProgressTrack } from "../../types/enrollment.types";

export interface IEnrolledService {
  getEnrolledCourses(learnerId: string): Promise<IEnrolledListDto[]>;
  getEnrolledCourseDetails(
    enrolledId: string,
  ): Promise<IEnrolledCoursedetailsDTO | null>;
  updatedProgress(
    enroledId: string,
    lecture: string,
  ): Promise<IProgressTrack | null>;
  addRating(enroledId: string, value: number): Promise<number>;
  getCourseEnrolledDashboardData(
    courseId: string,
    mentorId: string,
  ): Promise<CourseDashboardDTO | null>;
  getTrendingCourseGraph(
    courseId: string,
    filter?: filter,
    startDate?: string,
    endDate?: string,
  ): Promise<IChartTrendDTO[]>;
  getMentorDashboardData(mentorId: string): Promise<IMentorDhasboardDTO>;
}
