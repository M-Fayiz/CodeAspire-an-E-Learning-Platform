import { IEnrolledListDto } from "../../types/dtos.type/enrolled.dto.type";

export interface IEnrolledService {
  getEnrolledCourses(learnerId: string): Promise<IEnrolledListDto[]>;
}
