import { ICourses, ILecture, ISession } from "../../types/courses.type";
import {
  ICourseDTO,
  ICourseListDTO,
  IFormCourseDTO,
} from "../../types/dtos.type/course.dtos.type";

export interface ICourseService {
  createCourses(course: ICourses): Promise<ICourses | null>;
  fetchCourses(): Promise<ICourseListDTO[] | null>;
  updateCourseData(
    courseId: string,
    courseData: Partial<ICourses> | ISession | ILecture,
    courseUpdatePart: "sessions" | "lecture" | "baseInformation",
  ): Promise<ICourses | null>;
  getCourse(courseId: string): Promise<ICourseDTO | null>;
  getDraftedCourses(mentorId: string): Promise<IFormCourseDTO[] | null>;
  addSessions(courseId: string, session: ISession): Promise<ICourseDTO>;
  addLectures(
    courseId: string,
    sessionId: string,
    lecture: ILecture,
  ): Promise<ICourseDTO>;
  editLecture(
    courseId: string,
    sessionId: string,
    lectureId: string,
    lecture: ILecture,
  ): Promise<ICourseDTO>;
  updateBaseCourseInfo(
    courseId: string,
    baseInfo: ICourses,
  ): Promise<ICourseDTO>;
}
