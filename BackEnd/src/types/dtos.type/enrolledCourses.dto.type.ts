import { IEnrolledModel } from "../../models/enrolled.model";
import { ICourseDTO } from "./course.dtos.type";

export interface IEnrolledCoursePopulatedDtos extends IEnrolledModel {
  course: ICourseDTO;
}
