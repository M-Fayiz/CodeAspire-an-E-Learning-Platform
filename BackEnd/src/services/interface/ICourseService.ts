import { Types } from "mongoose";
import { ICourses, ILecture, ISession } from "../../types/courses.type";
import {
  ICourseCreateForm,
  ICourseDetailsPageDTO,
  ICourseDTO,
  ICourseListDTO,
  IFormCourseDTO,
  IListCourseSlot,
} from "../../types/dtos.type/course.dtos.type";
import { INotificationDTO } from "../../types/dtos.type/notification.dto.types";
import { IUser } from "../../types/user.types";

export interface ICourseService {
  createCourses(course: ICourses): Promise<ICourseCreateForm | null>;
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
  ): Promise<{
    courseDetails: ICourseDetailsPageDTO;
    enrolledId: Types.ObjectId | null;
  }>;
  getAdminCourseDetails(courseId: string): Promise<IFormCourseDTO>;
  getDraftedCourses(
    search: string,
    page: string,
    mentorId: string,
  ): Promise<{ courseData: IFormCourseDTO[]; totalPage: number } | null>;
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
  getAdminCourse(
    search: string,
    page: number,
  ): Promise<IFormCourseDTO[] | null>;
  getCourseDetails(courseId: string): Promise<IFormCourseDTO | null>;
  approveCourse(courseId: string): Promise<{
    status: string | null;
    notifyDTO: INotificationDTO;
  }>;
  rejectCourse(
    courseId: string,
    feedBack: string,
    email: string,
  ): Promise<{ courseStatus: string | null; notifyDTO: INotificationDTO }>;
  publishCourse(courseId: string): Promise<string | null>;
  fetchCourseListForSlot(mentorId: string): Promise<IListCourseSlot[] | null>;
  getCourseFormData(courseId: string,user:IUser): Promise<ICourseCreateForm>;
  removeSession(
    courseId: string,
    sessionId: string,
  ): Promise<ICourseCreateForm | null>;
}
