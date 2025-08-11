import { Types } from "mongoose";
import { courseModel } from "../../models/courses.model";
import { ICourses, ISession } from "../../types/courses.type";
import { BaseRepository } from "../baseRepository";
import { ICourseRepository } from "../interface/ICourseRepository";

export class CourseRepository
  extends BaseRepository<ICourses>
  implements ICourseRepository
{
  constructor() {
    super(courseModel);
  }
  async createCourses(courseData: ICourses): Promise<ICourses | null> {
    return await this.create(courseData);
  }
  async fetchCourses(): Promise<ICourses[] | null> {
    return await this.findAll(["categoryId", "subCategoryId"]);
  }
  async updateCourse(
    courseId: Types.ObjectId,
    courseData: Partial<ICourses>,
  ): Promise<ICourses | null> {
    return await this.findByIDAndUpdate(courseId, courseData);
  }
  async addSession(
    courseId: Types.ObjectId,
    session: ISession,
  ): Promise<ICourses | null> {
    return await this.PushToArray(courseId, "sessions", session);
  }
  async getCourse(courseId: Types.ObjectId): Promise<ICourses | null> {
    return await this.findById(courseId,["categoryId", "subCategoryId"])
  }
  async getMentorDraftedCourses(mentorId: Types.ObjectId): Promise<ICourses[]| null> {
      return this.find({mentorsId:mentorId})
  }
}
