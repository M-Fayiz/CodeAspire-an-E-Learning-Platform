import { ICourses } from "../types/courses.type";
import {
  CourseDashboardDTO,
  IChartTrendDTO,
} from "../types/dtos.type/courseDashboard.dto.type";
import { IRevenueAggregationResult } from "../types/courseDashboard.type";
import { chartAggregation } from "../types/enrollment.types";

export function courseDashboardDTO(
  enrolledStudents: number,
  avgRating: number,
  course: ICourses,
  revenue: IRevenueAggregationResult,
): CourseDashboardDTO {
  return {
    enrolledStudents,
    avgRating,
    course: {
      _id: course.id as string,
      title: course.title as string,
      description: course.description as string,
      price: course.price,
      thumbnail: course.thumbnail as string,
      status: course.status as string,
    },
    revenue: {
      admin: revenue.adminSum ?? null,
      mentor: revenue.mentorSum ?? null,
    },
  };
}

export function chartTrendDTO(data: chartAggregation): IChartTrendDTO {
  return {
    date: data._id.day,
    enrolled: data.count,
  };
}
