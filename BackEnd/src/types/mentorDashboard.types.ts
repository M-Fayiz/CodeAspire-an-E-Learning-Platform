import { Types } from "mongoose";
import { TransactionType } from "../const/transaction.const";


export interface IMentorDashboardData {
  avgRating: number;
  totalStudents: number;
}

export interface IMentorTotalRevanue {
  _id: TransactionType;
  revenue: number;
}
export interface ITopCourse {
  courseId: Types.ObjectId;
  title: string;
  enrolledStudent: number;
  revanue:number
}
export interface ITopCategory {
  categoryId: Types.ObjectId;
  title: string;
  enrolledStudent: number;
}
