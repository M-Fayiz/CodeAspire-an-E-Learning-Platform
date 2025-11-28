import type { ITopCourse } from "./mentorDashboard.dto.type";

export type IPaymentTypes='COURSE_PURCHASE'| "SLOT_BOOKING"


export interface SourceOfRevanye{
  name:IPaymentTypes,
  value:number
}
export interface IAdminDashboardDTO {
  totalMentors: number;
  totalLearners: number;
  SourceOfRevenue:SourceOfRevanye[] ;
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
