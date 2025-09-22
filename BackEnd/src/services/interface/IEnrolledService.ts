import {
  ICourseProgess,
  IEnrolledCoursedetailsDTO,
  IEnrolledListDto,
} from "../../types/dtos.type/enrolled.dto.type";

export interface IEnrolledService {
  getEnrolledCourses(learnerId: string): Promise<IEnrolledListDto[]>;
  getEnrolledCourseDetails(
    enrolledId: string,
  ): Promise<IEnrolledCoursedetailsDTO | null>;
  updatedProgress(enroledId:string,sessionId:string,lectureId:string):Promise<ICourseProgess|null>

}
