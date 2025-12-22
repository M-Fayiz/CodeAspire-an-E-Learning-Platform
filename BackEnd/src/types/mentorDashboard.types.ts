import { Types } from "mongoose";
import { IPaymentTypes } from "./transaction.type";

export interface IMentorDashboardData {
  avgRating: number;
  totalStudents: number;
}

export interface IMentorTotalRevanue {
  _id: IPaymentTypes;
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
