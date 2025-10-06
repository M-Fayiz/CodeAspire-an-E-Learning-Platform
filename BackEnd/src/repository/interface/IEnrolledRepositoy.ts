import { Types } from "mongoose";
import { IEnrolledModel } from "../../models/enrolled.model";
import {
  chartAggregation,
  chartFilter,
  IEnrolledAggregation,
  IEnrollement,
} from "../../types/enrollment.types";
import {
  IMentorDashboardData,
  ITopCategory,
  ITopCourse,
} from "../../types/mentorDashboard.types";

export interface IEnrolledRepository {
  enrolleCourse(enrollData: IEnrollement): Promise<IEnrolledModel | null>;
  getEnrolledCourses(
    learnerId: Types.ObjectId,
  ): Promise<IEnrolledModel[] | null>;
  getEnrolledCOurseDetails(
    enrolledId: Types.ObjectId,
  ): Promise<IEnrolledModel | null>;
  isEnrolled(
    userId: Types.ObjectId,
    courseId: Types.ObjectId,
  ): Promise<IEnrolledModel | null>;
  updatedProgress(
    enrolledId: Types.ObjectId,
    lecture: Types.ObjectId,
  ): Promise<IEnrolledModel | null>;
  addRating(
    enrolledId: Types.ObjectId,
    value: number,
  ): Promise<IEnrolledModel | null>;
  getEnrolledDasgboardData(
    courseId: Types.ObjectId,
    mentorId: Types.ObjectId,
  ): Promise<IEnrolledAggregation[] | null>;
  getCourseEnrollmentTrend(
    courseId: Types.ObjectId,
    filterChart: chartFilter,
  ): Promise<chartAggregation[]>;
  getMentorDashboardData(
    mentorId: Types.ObjectId,
  ): Promise<IMentorDashboardData[]>;
  getTopSellingCourse(mentorId?: Types.ObjectId): Promise<ITopCourse[]>;
  getTopSellingCategory(mentorId?: Types.ObjectId): Promise<ITopCategory[]>;
}
