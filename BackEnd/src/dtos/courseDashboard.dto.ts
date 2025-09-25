import { ICourses } from "../types/courses.type";
import { CourseDashboardDTO } from "../types/dtos.type/CourseDashboard.dto.type";
import { IRevenueAggregationResult } from "../types/CourseDashboard.type";

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
      title: course.thumbnail as string,
      description: course.description as string,
      price: course.price,
      thumbnail: course.thumbnail as string,
    },
    revenue: {
      admin: revenue.adminSum,
      mentor: revenue.mentorSum,
    },
  };
}
