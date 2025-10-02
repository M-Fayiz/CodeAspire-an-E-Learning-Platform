import { parseObjectId } from "../../mongoose/objectId";
import { ICategoryRepository } from "../../repository/interface/ICategoryRepository";
import { ICourseRepository } from "../../repository/interface/ICourseRepository";
import { ICourses, ILecture, ISession } from "../../types/courses.type";
import { ICourseService } from "../interface/ICourseService";

import {
  ICourseDTO,
  ICourseListDTO,
  ICoursesPopulated,
  IFormCourseDTO,
} from "../../types/dtos.type/course.dtos.type";
import {
  courseDTO,
  courseListDTO,
  formCourseDto,
} from "../../dtos/course.dtos";
import { createHttpError } from "../../utility/http-error";
import { HttpStatus } from "../../const/http-status";
import { HttpResponse } from "../../const/error-message";
import { sendMail } from "../../utility/send-mail.util";
import { Types } from "mongoose";
import { IEnrolledRepository } from "../../repository/interface/IEnrolledRepositoy";
import logger from "../../config/logger.config";

export class CourseService implements ICourseService {
  constructor(
    private _courseRepository: ICourseRepository,
    private _categoryRepository: ICategoryRepository,
    private _enrolledRepository: IEnrolledRepository,
  ) {}

  async createCourses(course: ICourses): Promise<ICourses | null> {
    return await this._courseRepository.createCourses(course);
  }
  async fetchCourses(
    page: number,
    limit: number,
    search?: string,
    category?: string,
    subcategory?: string,
    level?: string,
    learnerId?: string,
  ): Promise<{ courseData: ICourseListDTO[] | null; totalPage: number }> {
    let category_Id;
    let subCategory_id;
    let learner_Id;

    if (category) {
      category_Id = parseObjectId(category);
    }
    if (subcategory) {
      subCategory_id = parseObjectId(subcategory);
    }
    if (learnerId) {
      learner_Id = parseObjectId(learnerId);
    }
    let skip = (page - 1) * limit;
    const [courseList, totalDocument] = await Promise.all([
      this._courseRepository.fetchCourses(
        limit,
        skip,
        search,
        category_Id as Types.ObjectId,
        subCategory_id as Types.ObjectId,
        level,
      ),
      this._courseRepository.findDocumentCount(
        search,
        category_Id as Types.ObjectId,
        subCategory_id as Types.ObjectId,
        level,
      ),
    ]);
    let enrolledCourse;
    if (learner_Id) {
      enrolledCourse =
        await this._enrolledRepository.getEnrolledCourses(learner_Id);
    }
    if (!courseList) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ITEM_NOT_FOUND);
    }
    const enrolledIds = new Set(
      enrolledCourse?.map((c) => c.courseId.toString()),
    );
    const mappedCourseList = courseList.map((course) =>
      courseListDTO(course as ICoursesPopulated, enrolledIds),
    );
    let totalPage = totalDocument / limit;
    return { courseData: mappedCourseList, totalPage };
  }
  async updateCourseData(
    courseId: string,
    courseData: Partial<ICourses> | ISession | ILecture,
    courseUpdatePart: "sessions" | "lecture" | "baseInformation",
  ): Promise<ICourses | null> {
    const Id = parseObjectId(courseId);
    if (!Id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }
    switch (courseUpdatePart) {
      case "sessions":
        return await this._courseRepository.addSession(
          Id,
          courseData as ISession,
        );
    }

    return null;
  }
  async getCourse(
    courseId: string,
    learnerId?: string,
  ): Promise<IFormCourseDTO | null> {
    const id = parseObjectId(courseId);
    const learner_id = parseObjectId(learnerId as string);
    if (!id) {
      throw createHttpError(HttpStatus.OK, HttpResponse.INVALID_ID);
    }
    const courseData = await this._courseRepository.getCourseDetails(id);
    let isEnrolled: boolean = false;
    if (learner_id) {
      const enrollData = await this._enrolledRepository.isEnrolled(
        learner_id,
        id,
      );
      if (enrollData) {
        isEnrolled = true;
      }
    }

    if (!courseData) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ITEM_NOT_FOUND);
    }

    return courseData ? formCourseDto(courseData[0]) : null;
  }

  async getDraftedCourses(mentorId: string): Promise<IFormCourseDTO[] | null> {
    const id = parseObjectId(mentorId);
    if (!id) {
      throw createHttpError(HttpStatus.OK, HttpResponse.INVALID_ID);
    }
    const data = await this._courseRepository.getMentorDraftedCourses(id);

    const mappedCourseList = data?.map((course) =>
      formCourseDto(course as ICourses),
    );
    return mappedCourseList ? mappedCourseList : null;
  }

  async addSessions(courseId: string, session: ISession): Promise<ICourseDTO> {
    const id = parseObjectId(courseId);

    if (!id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }
    const isExist = await this._courseRepository.findSession(id, session.title);
    if (isExist) {
      throw createHttpError(HttpStatus.CONFLICT, HttpResponse.ITEM_EXIST);
    }
    const courseData = await this._courseRepository.addSession(id, session);
    return courseDTO(courseData as ICoursesPopulated);
  }
  async addLectures(
    courseId: string,
    sessionId: string,
    lecture: ILecture,
  ): Promise<ICourseDTO> {
    const CourseId = parseObjectId(courseId);
    const SessionId = parseObjectId(sessionId);
    if (!CourseId || !SessionId) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }
    const isExist = await this._courseRepository.findLecture(
      CourseId,
      SessionId,
      lecture.title,
    );
    if (isExist) {
      throw createHttpError(HttpStatus.CONFLICT, HttpResponse.ITEM_EXIST);
    }
    const courseData = await this._courseRepository.addLecture(
      CourseId,
      SessionId,
      lecture,
    );

    return courseDTO(courseData as ICoursesPopulated);
  }
  async editLecture(
    courseId: string,
    sessionId: string,
    lectureId: string,
    lecture: ILecture,
  ): Promise<ICourseDTO> {
    const CourseId = parseObjectId(courseId);
    const SessionId = parseObjectId(sessionId);
    const LectureId = parseObjectId(lectureId);
    if (!CourseId || !SessionId || !LectureId) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }

    const coursedata = await this._courseRepository.editLecture(
      CourseId,
      SessionId,
      LectureId,
      lecture,
    );
    return courseDTO(coursedata as ICoursesPopulated);
  }
  async updateBaseCourseInfo(
    courseId: string,
    baseInfo: ICourses,
  ): Promise<ICourseDTO> {
    const id = parseObjectId(courseId);
    if (!id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }
    const updatedData = await this._courseRepository.updateBaseInfo(
      id,
      baseInfo,
    );
    return courseDTO(updatedData as ICoursesPopulated);
  }
  async getAdminCourse(): Promise<IFormCourseDTO[] | null> {
    const adminCoursList = await this._courseRepository.getAdminCoursList();

    return adminCoursList
      ? adminCoursList.map((course) =>
          formCourseDto(course as ICoursesPopulated),
        )
      : null;
  }
  async getCourseDetails(courseId: string): Promise<IFormCourseDTO | null> {
    const id = parseObjectId(courseId);
    if (!id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }
    const courseDetails = await this._courseRepository.getCourseDetails(id);
    return courseDetails ? formCourseDto(courseDetails[0]) : null;
  }
  async approveCourse(courseId: string): Promise<string | null> {
    const id = parseObjectId(courseId);
    if (!id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }
    const courseDetails = await this._courseRepository.appproveCourse(id);
    return courseDetails ? courseDetails.status : null;
  }
  async rejectCourse(
    courseId: string,
    feedBack: string,
    email: string,
  ): Promise<string | null> {
    const id = parseObjectId(courseId);
    if (!id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }
    const courseDetails = await this._courseRepository.rejectCourse(id);
    if (courseDetails?.status == "rejected") {
      await sendMail(email, "Feedback On Your Course", feedBack);
    }
    return courseDetails ? courseDetails.status : null;
  }
  async publishCourse(courseId: string): Promise<string | null> {
    const id = parseObjectId(courseId);
    if (!id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }
    const courseDetails = await this._courseRepository.publishCourse(id);
    return courseDetails ? courseDetails.status : null;
  }
}
