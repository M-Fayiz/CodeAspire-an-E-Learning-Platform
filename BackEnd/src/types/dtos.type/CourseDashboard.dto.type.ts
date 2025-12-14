import { Types } from "mongoose";

export interface IRevenue {
  admin: number;
  mentor: number;
}
export interface CourseDashboardDTO {
  enrolledStudents: number;
  avgRating: number;
  course: {
    _id: Types.ObjectId;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    status: string;
  };

  revenue: IRevenue;
}

export interface IChartTrendDTO {
  date: Date;
  enrolled: number;
}
