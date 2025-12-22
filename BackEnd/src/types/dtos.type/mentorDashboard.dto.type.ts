import { TransactionType } from "../../const/transaction.const";
import { IMentorDashboardData, ITopCourse } from "../mentorDashboard.types";

 


export interface IMentorDhasboardDTO {
  summary: IMentorDashboardData;
  revanue: {
    name: TransactionType;
    value: number;
  }[];
  topCourse: ITopCourse[];
}
