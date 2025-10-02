import { IEnrolledModel } from "../../models/enrolled.model";
import { ICourses, ILecture, ISession } from "../../types/courses.type";
import {
  ICourseDTO,
  ICourseListDTO,
  IFormCourseDTO,
} from "../../types/dtos.type/course.dtos.type";

export interface ICourseService {
  createCourses(course: ICourses): Promise<ICourses | null>;
  fetchCourses(
    page: number,
    limit: number,
    search?: string,
    category?: string,
    subcategory?: string,
    level?: string,
    learnerId?: string,
  ): Promise<{ courseData: ICourseListDTO[] | null; totalPage: number }>;
  updateCourseData(
    courseId: string,
    courseData: Partial<ICourses> | ISession | ILecture,
    courseUpdatePart: "sessions" | "lecture" | "baseInformation",
  ): Promise<ICourses | null>;
  getCourse(
    courseId: string,
    learnerId?: string,
  ): Promise<IFormCourseDTO | null>;
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
  getAdminCourse(): Promise<IFormCourseDTO[] | null>;
  getCourseDetails(courseId: string): Promise<IFormCourseDTO | null>;
  approveCourse(courseId: string): Promise<string | null>;
  rejectCourse(
    courseId: string,
    feedBack: string,
    email: string,
  ): Promise<string | null>;
  publishCourse(courseId: string): Promise<string | null>;
}
