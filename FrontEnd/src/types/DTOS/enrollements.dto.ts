import type { IFormCourseDTO } from "../courses.types";

export interface IEnrolledListDto {
  _id: string;
  course: IFormCourseDTO;
  completedPercentage: number;
}
