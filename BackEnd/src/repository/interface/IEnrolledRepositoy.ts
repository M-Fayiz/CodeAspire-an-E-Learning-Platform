import { Types } from "mongoose";
import { IEnrolledModel } from "../../models/enrolled.model";
import { IEnrollement } from "../../types/enrollment.types";
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
  updatedProgress(enrolledId:Types.ObjectId,sessionId:Types.ObjectId,lectureId:Types.ObjectId):Promise<IEnrolledModel|null>
}
