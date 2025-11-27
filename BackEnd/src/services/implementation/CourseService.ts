import { parseObjectId } from "../../mongoose/objectId";
import { ICategoryRepository } from "../../repository/interface/ICategoryRepository";
import { ICourseRepository } from "../../repository/interface/ICourseRepository";
import { ICourses, ILecture, ISession } from "../../types/courses.type";
import { ICourseService } from "../interface/ICourseService";

import {
  ICourseDTO,
  ICourseListDTO,
  IPopulatedCourse,
  IFormCourseDTO,
  IListCourseSlot,
  ICourseCreateForm,
} from "../../types/dtos.type/course.dtos.type";
import {
  courseDTO,
  CourseFormDataDTO,
  courseListDTO,
  formCourseDto,
  listCourseForSLot,
} from "../../dtos/course.dtos";
import { createHttpError } from "../../utils/http-error";
import { HttpStatus } from "../../const/http-status";
import { HttpResponse } from "../../const/error-message";
import { sendMail } from "../../utils/send-mail.util";
import { FilterQuery, Types } from "mongoose";
import { IEnrolledRepository } from "../../repository/interface/IEnrolledRepositoy";
import { INotificationRepository } from "../../repository/interface/INotificationRepository";
import { NotificationTemplates } from "../../template/notification.template";
import { INotificationDTO } from "../../types/dtos.type/notification.dto.types";
import { notificationDto } from "../../dtos/notification.dto";

export class CourseService implements ICourseService {
  constructor(
    private _courseRepository: ICourseRepository,
    private _categoryRepository: ICategoryRepository,
    private _enrolledRepository: IEnrolledRepository,
    private _notificationRepository: INotificationRepository,
  ) {}

  async createCourses(course: ICourses): Promise<ICourseCreateForm | null> {

    const mentorCourse=await this._courseRepository.findAllCourse({mentorsId:course.mentorsId,categoryId:course.categoryId})

    if(mentorCourse&&mentorCourse.length>2){
      throw createHttpError(HttpStatus.CONFLICT,HttpResponse.ITEM_EXIST)
    }

    const createdCourse=await this._courseRepository.createCourses(course);
    return CourseFormDataDTO(createdCourse as ICourses)
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
    let query: FilterQuery<ICourses> = {};
    if (search) {
      query["title"] = { $regex: search, $options: "i" };
    }
    if (category) {
      query["`categoryId`"] = category;
    }
    if (subcategory) {
      query["subCategoryId"] = subcategory;
    }
    if (level) {
      query["level"] = level;
    }

    query["status"] = "approved";

    const [courseList, totalDocument] = await Promise.all([
      this._courseRepository.fetchCourses(
        limit,
        skip,
        search,
        category_Id as Types.ObjectId,
        subCategory_id as Types.ObjectId,
        level,
      ),
      this._courseRepository.findDocumentCount(query),
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
      courseListDTO(course as IPopulatedCourse, enrolledIds),
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
    console.log('udate course',Id)
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

  async getDraftedCourses(
    search: string,
    page: string,
    mentorId: string,
  ): Promise<{ courseData: IFormCourseDTO[]; totalPage: number } | null> {
    const id = parseObjectId(mentorId);
    if (!id) {
      throw createHttpError(HttpStatus.OK, HttpResponse.INVALID_ID);
    }
    let limit = 6;
    let skip = (Number(page) - 1) * limit;
    let query: FilterQuery<ICourses> = {};
    if (search) {
      query["title"] = { $regex: search, $options: "i" };
    }

    query["mentorsId"] = mentorId;

    
    const [data, documnetCount] = await Promise.all([
      this._courseRepository.getMentorDraftedCourses(search, limit, skip, id),
      this._courseRepository.findDocumentCount(query),
    ]);

    const mappedCourseList = data?.map((course) =>
      formCourseDto(course as IPopulatedCourse),
    );
    let totalPage = Math.floor(documnetCount / limit);
    console.log(totalPage);
    return mappedCourseList
      ? { courseData: mappedCourseList, totalPage: totalPage }
      : null;
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
    return courseDTO(courseData as IPopulatedCourse);
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

    return courseDTO(courseData as IPopulatedCourse);
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
    return courseDTO(coursedata as IPopulatedCourse);
  }
  async updateBaseCourseInfo(
    courseId: string,
    baseInfo: ICourses,
  ): Promise<ICourseDTO> {
    const id = parseObjectId(courseId);
    console.log('base infor ',id)
    if (!id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }
    const updatedData = await this._courseRepository.updateBaseInfo(
      id,
      baseInfo,
    );
    return courseDTO(updatedData as IPopulatedCourse);
  }
  async getAdminCourse(): Promise<IFormCourseDTO[] | null> {
    const adminCoursList = await this._courseRepository.getAdminCoursList();
    console.log(adminCoursList);
    return adminCoursList
      ? adminCoursList.map((course) =>
          formCourseDto(course as IPopulatedCourse),
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
  async approveCourse(courseId: string): Promise<{
    status: string | null;
    notifyDTO: INotificationDTO;
  }> {
    const course_id = parseObjectId(courseId);
    if (!course_id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }

    const courseDetails =
      await this._courseRepository.appproveCourse(course_id);

    const notifyData = NotificationTemplates.courseApproval(
      courseDetails?.mentorsId as Types.ObjectId,
      courseDetails?.title as string,
    );
    const savedNotify =
      await this._notificationRepository.createNotification(notifyData);
    const notifyDTO = notificationDto(savedNotify);
    return {
      status: courseDetails?.status ? courseDetails?.status : null,
      notifyDTO,
    };
  }
  async rejectCourse(
    courseId: string,
    feedBack: string,
    email: string,
  ): Promise<{ courseStatus: string | null; notifyDTO: INotificationDTO }> {
    const id = parseObjectId(courseId);
    if (!id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }
    const courseDetails = await this._courseRepository.rejectCourse(id);
    const notifyData = NotificationTemplates.courseRejection(
      courseDetails?.mentorsId as Types.ObjectId,
      courseDetails?.title as string,
      feedBack,
    );
    const savedNotify =
      await this._notificationRepository.createNotification(notifyData);
    const notifyDTO = notificationDto(savedNotify);

    if (courseDetails?.status == "rejected") {
      await sendMail(email, "Feedback On Your Course", feedBack);
    }
    return {
      courseStatus: courseDetails ? courseDetails.status : null,
      notifyDTO,
    };
  }
  async publishCourse(courseId: string): Promise<string | null> {
    const id = parseObjectId(courseId);
    if (!id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }
    const courseDetails = await this._courseRepository.publishCourse(id);
    return courseDetails ? courseDetails.status : null;
  }

  /**
   * Fetches a mentor’s courses and maps them to a simplified DTO
   * containing only course IDs and titles.
   * @param mentorId
   * @returnsA promise resolving to an array of course summaries
   * @throws HttpErros if no course are found
   */
  async fetchCourseListForSlot(
    mentorId: string,
  ): Promise<IListCourseSlot[] | null> {
    const mentor_Id = parseObjectId(mentorId);

    const courseList = await this._courseRepository.findAllCourse({
      mentorsId: mentor_Id,
    });
    if (!courseList) {
      throw createHttpError(
        HttpStatus.NOT_FOUND,
        HttpResponse.COURSE_NOT_FOUND,
      );
    }

    return courseList.map((course) => listCourseForSLot(course));
  }
  async getCourseFormData(courseId: string): Promise<ICourseCreateForm> {
      const course_Id=parseObjectId(courseId)
      if(!course_Id){
        throw createHttpError(HttpStatus.BAD_REQUEST,HttpResponse.INVALID_ID)
      }

      const courseFormData=await this._courseRepository.getCourseFormData(course_Id)
      if(!courseFormData){
        throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.COURSE_NOT_FOUND)
      }

      return CourseFormDataDTO(courseFormData )
  }
}
