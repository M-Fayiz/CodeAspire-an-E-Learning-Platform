import { FilterQuery, Types } from "mongoose";
import { ICourses, ILecture, ISession } from "../../types/courses.type";
import { IPopulatedCourse } from "../../types/dtos.type/course.dtos.type";

export interface ICourseRepository {
  createCourses(courseData: ICourses): Promise<ICourses | null>;
  fetchCourses(
    limit: number,
    skip: number,
    search?: string,
    category?: Types.ObjectId,
    subcategory?: Types.ObjectId,
    level?: string,
  ): Promise<ICourses[] | null>;
  updateCourse(
    courseId: Types.ObjectId,
    courseData: Partial<ICourses>,
  ): Promise<ICourses | null>;
  addSession(
    courseId: Types.ObjectId,
    session: ISession,
  ): Promise<ICourses | null>;
  updateBaseInfo(
    courseId: Types.ObjectId,
    baseInfo: ICourses,
  ): Promise<ICourses | null>;
  getCourse(courseId: Types.ObjectId): Promise<ICourses | null>;
  getMentorDraftedCourses(
    search: string,
    limit: number,
    skip: number,
    mentorId: Types.ObjectId,
  ): Promise<ICourses[] | null>;
  addLecture(
    courseId: Types.ObjectId,
    sessionId: Types.ObjectId,
    lecture: ILecture,
  ): Promise<ICourses | null>;
  findSession(
    courseId: Types.ObjectId,
    title: string,
  ): Promise<ICourses | null>;
  findLecture(
    courseId: Types.ObjectId,
    sessionsId: Types.ObjectId,
    title: string,
  ): Promise<ICourses | null>;
  editLecture(
    courseId: Types.ObjectId,
    sessionId: Types.ObjectId,
    lectureId: Types.ObjectId,
    lecture: ILecture,
  ): Promise<ICourses | null>;
  getAdminCoursList(): Promise<IPopulatedCourse[] | null>;
  getCourseDetails(
    courseId: Types.ObjectId,
  ): Promise<IPopulatedCourse[] | null>;
  appproveCourse(courseId: Types.ObjectId): Promise<ICourses | null>;
  rejectCourse(courseId: Types.ObjectId): Promise<ICourses | null>;
  publishCourse(courseId: Types.ObjectId): Promise<ICourses | null>;
  findCourse(courseId: Types.ObjectId): Promise<ICourses | null>;
  findDocumentCount(query: FilterQuery<ICourses>): Promise<number>;
  findAllCourse(query: FilterQuery<ICourses>): Promise<ICourses[] | null>;
}
