
import { ILearnerModel } from "../models/user.model";
import { learnerDashboardCardsDTO } from "../types/dtos.type/learnerDashboard.dto.type";
import {
  InProgressCourse,
  LearnerCourseCard,
  LearnerSlotCard,
} from "../types/learnerDashboard.type";




export const learnerDashboardDetails = (
  courseData: Partial<LearnerCourseCard> = {},
  slotData: Partial<LearnerSlotCard> = {},
  TotalCertificate = 0,
  learner:ILearnerModel,
  inProgress:InProgressCourse[]
): learnerDashboardCardsDTO => {
  const InProgressCourse=inProgress.map(course=>{
    return{
      enrolledId:course._id,
      title:course.courseId.title,
      progress:course.progress.completionPercentage
    }
  })
  return{

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
    activeDays:learner.activeDates??[],
    learnerStreak:learner.learningStreak??null,
    inProgress:InProgressCourse    
  }
};
