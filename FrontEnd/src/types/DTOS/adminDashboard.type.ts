import type { ITopCourse } from "./mentorDashboard.dto.type";

export interface IAdminDashboardDTO {
  totalMentors: number;
  totalLearners: number;
  totalRevenue: number;
  totalCourses: number;
  topSelling: {
    course: ITopCourse[];
    category: ITopCategory[];
  };
}
export interface ITopCategory {
  categoryId: string;
  title: string;
  enrolledStudent: number;
}
