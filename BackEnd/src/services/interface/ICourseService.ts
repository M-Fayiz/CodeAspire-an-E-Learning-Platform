import { ICourses, ILecture, ISession } from "../../types/courses.type";
import { ICourseDTO, ICourseListDTO } from "../../types/dtos.type/course.dtos.type";

export interface ICourseService {
  createCourses(course: ICourses): Promise<ICourses | null>;
  fetchCourses(): Promise<ICourseListDTO[] | null>;
  updateCourseData(
    courseId: string,
    courseData: Partial<ICourses> | ISession | ILecture,
    courseUpdatePart: "sessions" | "lecture" | "baseInformation",
  ): Promise<ICourses | null>;
  getCourse(courseId:string):Promise<ICourseDTO|null>
  getDraftedCourses(mentorId:string):Promise<ICourseDTO[]|null>
}
