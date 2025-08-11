import { Types } from "mongoose";
import { ICourses, ILecture, ISession } from "../../types/courses.type";
import { Type } from "@aws-sdk/client-s3";

export interface ICourseRepository {
  createCourses(courseData: ICourses): Promise<ICourses | null>;
  fetchCourses(): Promise<ICourses[] | null>;
  updateCourse(
    courseId: Types.ObjectId,
    courseData: Partial<ICourses>,
  ): Promise<ICourses | null>;
  addSession(
    courseId: Types.ObjectId,
    session: ISession,
  ): Promise<ICourses | null>;
  // addLecture(courseId:Types.ObjectId,lecture:ILecture):Promise<ILecture|null>
  // updateBaseInfo(courseId:Types.ObjectId,baseInfo:Partial<ICourses>):Promise<ICourses|null>
  getCourse(courseId:Types.ObjectId):Promise<ICourses|null>
  getMentorDraftedCourses(mentorId:Types.ObjectId):Promise<ICourses[]|null>
}
