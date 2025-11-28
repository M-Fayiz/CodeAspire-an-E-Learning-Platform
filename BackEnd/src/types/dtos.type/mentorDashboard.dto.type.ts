import { IMentorDashboardData, ITopCourse } from "../mentorDashboard.types";
import { IPaymentTypes } from "../transaction.type";

export interface IMentorDhasboardDTO {
  summary: IMentorDashboardData;
  revanue: {
    name:IPaymentTypes,
    value:number
  }[];
  topCourse: ITopCourse[];
}
