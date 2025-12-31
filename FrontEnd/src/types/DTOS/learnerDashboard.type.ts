export interface learnerDashboardCardsDTO {
  courseData: LearnerCourseCard;
  slotData: LearnerSlotCard;
  TotalCertificate: number;
   learnerStreak:ILearnerStreask|null
  activeDays:string[]
}
export interface ILearnerStreask{
current: number;       
  longest: number;        
  lastLearningDate: Date;
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
