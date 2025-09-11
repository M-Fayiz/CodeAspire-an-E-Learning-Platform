import { Types } from "mongoose";
import { IEnrolledModel } from "../../models/enrolled.model";
import { IEnrollement } from "../../types/enrollment.types";
export interface IEnrolledRepository {
  enrolleCourse(enrollData: IEnrollement): Promise<IEnrolledModel | null>;
  getEnrolledCourses(
    learnerId: Types.ObjectId,
  ): Promise<IEnrolledModel[] | null>;
}
