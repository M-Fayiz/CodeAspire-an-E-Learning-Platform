export interface learnerDashboardCardsDTO {
  courseData: LearnerCourseCard;
  slotData: LearnerSlotCard;
  TotalCertificate: number;
}

export interface LearnerCourseCard {
  courseCount: number;
  completedCourse: number;
  inProgressCourse: number;
}

export interface LearnerSlotCard {
  totalSession: number;
  totalCracked: number;
  totalFailed: number;
}
