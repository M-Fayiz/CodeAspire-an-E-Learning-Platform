import { IEnrolledModel } from "../../models/enrolled.model";
import { ICourseDTO } from "./course.dtos.type";

interface IEnrolledCoursePopulatedDtos extends IEnrolledModel {
  course: ICourseDTO;
}
