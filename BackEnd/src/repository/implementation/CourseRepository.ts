import { Types } from "mongoose";
import { courseModel } from "../../models/courses.model";
import { ICourses, ILecture, ISession } from "../../types/courses.type";
import { BaseRepository } from "../baseRepository";
import { ICourseRepository } from "../interface/ICourseRepository";
import logger from "../../config/logger.config";

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
    return await this.find({ status: "approved" }, [
      "categoryId",
      "subCategoryId",
    ]);
  }
  async updateCourse(
    courseId: Types.ObjectId,
    courseData: Partial<ICourses>,
  ): Promise<ICourses | null> {
    return await this.findByIDAndUpdate(courseId, courseData);
  }
  async getCourse(courseId: Types.ObjectId): Promise<ICourses | null> {
    return await this.findById(courseId, ["categoryId", "subCategoryId"]);
  }
  async getMentorDraftedCourses(
    mentorId: Types.ObjectId,
  ): Promise<ICourses[] | null> {
    return await this.find({ mentorsId: mentorId }, [
      "categoryId",
      "subCategoryId",
    ]);
  }
  async addSession(
    courseId: Types.ObjectId,
    session: ISession,
  ): Promise<ICourses | null> {
    return await this.PushToArray(courseId, "sessions", session);
  }
  async addLecture(
    courseId: Types.ObjectId,
    sessionId: Types.ObjectId,
    lecture: ILecture,
  ): Promise<ICourses | null> {
    return await this.PushToArray(
      { _id: courseId, "sessions._id": sessionId },
      "sessions.$.lectures",
      lecture,
    );
  }
  async findSession(
    courseId: Types.ObjectId,
    title: string,
  ): Promise<ICourses | null> {
    return await this.findOne({
      _id: courseId,
      "sessions.title": { $regex: title, $options: "i" },
    });
  }
  async findLecture(
    courseId: Types.ObjectId,
    sessionId: Types.ObjectId,
    title: string,
  ): Promise<ICourses | null> {
    return await this.findOne({
      _id: courseId,
      sessions: {
        $elemMatch: {
          _id: sessionId,
          lectures: { $elemMatch: { title: { $regex: title, $options: "i" } } },
        },
      },
    });
  }
  async editLecture(
    courseId: Types.ObjectId,
    sessionId: Types.ObjectId,
    lectureId: Types.ObjectId,
    lecture: ILecture,
  ): Promise<ICourses | null> {
    logger.info("lecture", lecture);
    return await this.findItemAndUpdate(
      { _id: courseId },
      {
        $set: {
          "sessions.$[s].lectures.$[l].title": lecture.title,
          "sessions.$[s].lectures.$[l].lectureType": lecture.lectureType,
          "sessions.$[s].lectures.$[l].lectureContent": lecture.lectureContent,
        },
      },
      {
        new: true,
        arrayFilters: [{ "s._id": sessionId }, { "l._id": lectureId }],
      },
    );
  }
  async updateBaseInfo(
    courseId: Types.ObjectId,
    baseInfo: ICourses,
  ): Promise<ICourses | null> {
    return await this.findByIDAndUpdate(courseId, baseInfo);
  }
  async getAdminCoursList(): Promise<ICourses[] | null> {
    return await this.find(
      { status: { $in: ["published", "rejected", "approved"] } },
      ["categoryId", "subCategoryId", "mentorsId"],
    );
  }
  async getCourseDetails(courseId: Types.ObjectId): Promise<ICourses[] | null> {
    return await this.find({ _id: courseId }, [
      "categoryId",
      "subCategoryId",
      "mentorsId",
    ]);
  }
  async appproveCourse(courseId: Types.ObjectId): Promise<ICourses | null> {
    return await this.findByIDAndUpdate(courseId, { status: "approved" });
  }
  async rejectCourse(courseId: Types.ObjectId): Promise<ICourses | null> {
    return await this.findByIDAndUpdate(courseId, { status: "rejected" });
  }
  async publishCourse(courseId: Types.ObjectId): Promise<ICourses | null> {
    return await this.findByIDAndUpdate(courseId, { status: "published" });
  }
  async findCourse(courseId: Types.ObjectId): Promise<ICourses | null> {
    return await this.findById(courseId, [
      "categoryId",
      "subCategoryId",
      "mentorsId",
    ]);
  }
}
