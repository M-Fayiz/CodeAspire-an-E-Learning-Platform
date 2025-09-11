import { Types } from "mongoose";
import { IFormCourseDTO } from "./course.dtos.type";

export interface IEnrolledListDto {
  _id: Types.ObjectId;
  course: IFormCourseDTO;
  completedPercentage: number;
}
