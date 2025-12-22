import { learnerDashboardCardsDTO } from "../types/dtos.type/learnerDashboard.dto.type";
import {
  LearnerCourseCard,
  LearnerSlotCard,
} from "../types/learnerDashboard.type";
export const learnerDashboardDetails = (
  courseData: Partial<LearnerCourseCard> = {},
  slotData: Partial<LearnerSlotCard> = {},
  TotalCertificate = 0,
): learnerDashboardCardsDTO => ({
  courseData: {
    courseCount: courseData.courseCount ?? 0,
    completedCourse: courseData.completedCourse ?? 0,
    inProgressCourse: courseData.inProgressCourse ?? 0,
  },
  slotData: {
    totalSession: slotData.totalSession ?? 0,
    totalCracked: slotData.totalCracked ?? 0,
    totalFailed: slotData.totalFailed ?? 0,
  },
  TotalCertificate,
});
