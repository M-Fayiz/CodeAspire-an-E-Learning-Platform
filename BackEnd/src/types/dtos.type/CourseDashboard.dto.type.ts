import { Types } from "mongoose";
import { ICourseDTO } from "./course.dtos.type";
export interface IRevenue {
  admin: number;
  mentor: number;
}
export interface CourseDashboardDTO {
  enrolledStudents: number;
  avgRating: number;
  course: {
    _id: string;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
  };

  revenue: IRevenue;
}
