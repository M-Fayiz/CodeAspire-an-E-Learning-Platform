import { IMentorDashboardData, ITopCourse } from "../mentorDashboard.types";

export interface IMentorDhasboardDTO {
  summary: IMentorDashboardData;
  revanue: number;
  topCourse: ITopCourse[];
}
