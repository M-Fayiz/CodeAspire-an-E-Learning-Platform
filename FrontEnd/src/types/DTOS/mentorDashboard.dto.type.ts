import type { SourceOfRevanye } from "./adminDashboard.type";

export interface IMentorDhasboardDTO {
  summary: IMentorDashboardData;
  revanue: SourceOfRevanye[];
  topCourse: ITopCourse[];
}

export interface IMentorDashboardData {
  avgRating: number;
  totalStudents: number;
}

export interface IMentorTotalRevanue {
  _id: null;
  revenue: number;
}
export interface ITopCourse {
  courseId: string;
  title: string;
  enrolledStudent: number;
  revenue: number;
}
