import type { PieChartProps } from "@/components/ui/PieGraph";
import type { ITopCourse } from "./mentorDashboard.dto.type";

export type IPaymentTypes = "COURSE_PURCHASE" | "SLOT_BOOKING";

export interface SourceOfRevanye {
  name: IPaymentTypes;
  value: number;
}
export interface IAdminDashboardDTO {
  totalMentors: number;
  totalLearners: number;
  SourceOfRevenue: PieChartProps<IPaymentTypes>[];
  totalCourses: number;
  topSelling: {
    course: ITopCourse[];
    category: ITopCategory[];
  };
  mentorStatus:Mentorstatus

}

export interface Mentorstatus{
    approved: number,
    rejected: number
  }

export interface ITopCategory {
  categoryId: string;
  title: string;
  enrolledStudent: number;
  revenue: number;
}
