import { IMentorDhasboardDTO } from "../types/dtos.type/mentorDashboard.dto.type";
import {
  IMentorDashboardData,
  IMentorTotalRevanue,
  ITopCourse,
} from "../types/mentorDashboard.types";

export function mentorDashboardDTO(
  studenAndRatinng: IMentorDashboardData | undefined,
  topCourse: ITopCourse[],
  revanue: IMentorTotalRevanue[],
): IMentorDhasboardDTO {
  const updatedFrmt = revanue.map((data) => ({
    name: data._id,
    value: data.revenue,
  }));

  const summary = {
    avgRating: studenAndRatinng?.avgRating ?? 0,
    totalStudents: studenAndRatinng?.totalStudents ?? 0,
  };

  return {
    summary,
    topCourse,
    revanue: updatedFrmt,
  };
}
