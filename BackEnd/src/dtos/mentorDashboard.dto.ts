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

  const rev = revanue.length === 0 ? 0 : revanue[0].revenue;

  const summary = {
    avgRating: studenAndRatinng?.avgRating ?? 0,
    totalStudents: studenAndRatinng?.totalStudents ?? 0,
  };

  return {
    summary,
    topCourse,
    revanue: rev,
  };
}

