
import {
  CourseDashboardDTO,
  IChartTrendDTO,
} from "../types/dtos.type/courseDashboard.dto.type";
import { IRevenueAggregationResult } from "../types/courseDashboard.type";
import { chartAggregation } from "../types/enrollment.types";
import { IPopulatedCourse } from "../types/dtos.type/course.dtos.type";

export function courseDashboardDTO(
  enrolledStudents: number,
  avgRating: number,
  course: IPopulatedCourse,
  revenue: IRevenueAggregationResult,
): CourseDashboardDTO {
  return {
    enrolledStudents,
    avgRating,
    course: {
      _id: course._id ,
      title: course.title as string,
      description: course.description as string,
      price: course.price,
      thumbnail: course.thumbnail as string,
      status: course.status as string,
    },
    revenue: {
      admin: (revenue && revenue.adminSum) ?? 0,
      mentor: (revenue && revenue.adminSum) ?? 0,
    },
  };
}

export function chartTrendDTO(data: chartAggregation): IChartTrendDTO {
  return {
    date: data._id.day,
    enrolled: data.count,
  };
}
