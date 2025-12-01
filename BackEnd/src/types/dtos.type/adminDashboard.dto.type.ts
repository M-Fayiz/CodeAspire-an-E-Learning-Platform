import { SourceOfRevanye } from "../adminDahsboard.type";
import { ITopCategory, ITopCourse } from "../mentorDashboard.types";
import { IPaymentTypes } from "../transaction.type";

interface RevanueSource {
  name: IPaymentTypes;
  value: number;
}

export interface IAdminDashboardDTO {
  totalMentors: number;
  totalLearners: number;
  SourceOfRevenue: RevanueSource[];
  totalCourses: number;
  topSelling: {
    course: ITopCourse[];
    category: ITopCategory[];
  };
}
