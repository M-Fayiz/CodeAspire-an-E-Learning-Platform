import { Types } from "mongoose";

export interface IMentorDashboardData {
  avgRating: number;
  totalStudents: number;
}

export interface IMentorTotalRevanue {
  _id: null;
  revenue: number;
}
export interface ITopCourse {
  courseId: Types.ObjectId;
  title: string;
  enrolledStudent: number;
}
export interface ITopCategory {
  categoryId: Types.ObjectId;
  title: string;
  enrolledStudent: number;
}
