import { IEnrolledModel } from "../models/enrolled.model";
import { IFormCourseDTO } from "../types/dtos.type/course.dtos.type";
import { IEnrolledListDto } from "../types/dtos.type/enrolled.dto.type";

export const enrolledListDTO = (
  enrolledData: IEnrolledModel,
): IEnrolledListDto => {
  return {
    _id: enrolledData._id,
    completedPercentage: enrolledData.progress?.completionPercentage??0,
    course: enrolledData.courseId as IFormCourseDTO,
  };
};
