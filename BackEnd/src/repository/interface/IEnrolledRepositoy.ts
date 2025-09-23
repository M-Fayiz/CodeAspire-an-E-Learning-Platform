import { Types } from "mongoose";
import { IEnrolledModel } from "../../models/enrolled.model";
import { IEnrollement } from "../../types/enrollment.types";

import { Type } from "@aws-sdk/client-s3";
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
}
