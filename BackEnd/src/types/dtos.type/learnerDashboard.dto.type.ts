import { Types } from "mongoose";
import { LearnerCourseCard, LearnerSlotCard } from "../learnerDashboard.type";
import { ILearnerStreask } from "../user.types";

export interface learnerDashboardCardsDTO {
  courseData: LearnerCourseCard;
  slotData: LearnerSlotCard;
  TotalCertificate: number;
  learnerStreak: ILearnerStreask | null;
  activeDays: Date[];
  inProgress: InProgress[];
}

export interface InProgress {
  enrolledId: Types.ObjectId;
  title: string;
  progress: number;
}
