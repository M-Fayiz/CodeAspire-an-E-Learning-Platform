export interface learnerDashboardCardsDTO {
  courseData: LearnerCourseCard;
  slotData: LearnerSlotCard;
  TotalCertificate: number;
   learnerStreak:ILearnerStreask|null
  activeDays:string[]
    inProgress:InProgress[]
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




export interface InProgress {
  enrolledId: string
  title: string;
  progress: number;
}