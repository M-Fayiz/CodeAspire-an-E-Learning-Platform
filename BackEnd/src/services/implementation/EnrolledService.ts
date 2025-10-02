import { Types } from "mongoose";
import { HttpResponse } from "../../const/error-message";
import { HttpStatus } from "../../const/http-status";
import { parseObjectId } from "../../mongoose/objectId";
import { ICourseRepository } from "../../repository/interface/ICourseRepository";
import { IEnrolledRepository } from "../../repository/interface/IEnrolledRepositoy";
import { IFormCourseDTO } from "../../types/dtos.type/course.dtos.type";
import { createHttpError } from "../../utility/http-error";
import { formCourseDto } from "../../dtos/course.dtos";
import type {
  IEnrolledCoursedetailsDTO,
  IEnrolledListDto,
} from "../../types/dtos.type/enrolled.dto.type";
import {
  enrolledCourseDetailDTO,
  enrolledListDTO,
} from "../../dtos/enrolled.dto";
import { IEnrolledModel } from "../../models/enrolled.model";
import { IEnrolledService } from "../interface/IEnrolledService";
import { ICourses } from "../../types/courses.type";
import {
  chartFilter,
  filter,
  IProgressTrack,
} from "../../types/enrollment.types";
import {
  CourseDashboardDTO,
  IChartTrendDTO,
} from "../../types/dtos.type/CourseDashboard.dto.type";
import { ITransactionRepository } from "../../repository/interface/ITransactionRepository";
import {
  chartTrendDTO,
  courseDashboardDTO,
} from "../../dtos/courseDashboard.dto";

export class EnrolledService implements IEnrolledService {
  constructor(
    private _erolledRepository: IEnrolledRepository,
    private _courseRepository: ICourseRepository,
    private _transactionRepository: ITransactionRepository,
  ) {}

  async getEnrolledCourses(learnerId: string): Promise<IEnrolledListDto[]> {
    const learner_id = parseObjectId(learnerId);
    if (!learner_id) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.INVALID_ID);
    }
    const enrolledData =
      await this._erolledRepository.getEnrolledCourses(learner_id);
    if (!enrolledData) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ITEM_NOT_FOUND);
    }
    const populatedEnrolledCourse = await Promise.all(
      enrolledData.map(async (course) => {
        const data = await this._courseRepository.findCourse(
          course.courseId as Types.ObjectId,
        );
        if (!data) return null;

        const populatedCourse = formCourseDto(data);

        return {
          ...course,
          courseId: populatedCourse as IFormCourseDTO,
        };
      }),
    );

    return populatedEnrolledCourse.map((course) =>
      enrolledListDTO(course as IEnrolledModel),
    );
  }
  async getEnrolledCourseDetails(
    enrolledId: string,
  ): Promise<IEnrolledCoursedetailsDTO | null> {
    const enrolled_Id = parseObjectId(enrolledId);
    if (!enrolled_Id) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.INVALID_ID);
    }
    const enrolledData =
      await this._erolledRepository.getEnrolledCOurseDetails(enrolled_Id);
    if (!enrolledData) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.INVALID_ID);
    }
    const courseData = await this._courseRepository.findCourse(
      enrolledData.courseId as Types.ObjectId,
    );

    const populatedCourse = formCourseDto(courseData as ICourses);
    return enrolledCourseDetailDTO(enrolledData, populatedCourse);
  }
  async updatedProgress(
    enroledId: string,
    lecture: string,
  ): Promise<IProgressTrack | null> {
    const enrolled_id = parseObjectId(enroledId);
    const lecture_id = parseObjectId(lecture);

    if (!enrolled_id || !lecture_id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }

    const enrolledData = await this._erolledRepository.updatedProgress(
      enrolled_id,
      lecture_id,
    );
    if (!enroledId) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ITEM_NOT_FOUND);
    }

    return enrolledData?.progress ?? null;
  }
  async addRating(enroledId: string, value: number): Promise<number> {
    const enrolled_id = parseObjectId(enroledId);
    if (!enrolled_id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }
    const updatedData = await this._erolledRepository.addRating(
      enrolled_id,
      value,
    );
    if (!updatedData?.rating) {
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.SERVER_ERROR,
      );
    }
    return updatedData.rating;
  }
  async getCourseEnrolledDashboardData(
    courseId: string,
    mentorId: string,
  ): Promise<CourseDashboardDTO | null> {
    const course_id = parseObjectId(courseId);
    const mentor_id = parseObjectId(mentorId);
    if (!course_id || !mentor_id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }
    const [studentsAndRating, course, revenue] = await Promise.all([
      this._erolledRepository.getEnrolledDasgboardData(course_id, mentor_id),
      this._courseRepository.findCourse(course_id),
      this._transactionRepository.getDashboardRevenue(course_id),
    ]);
    if (!studentsAndRating || !course || !revenue) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ITEM_NOT_FOUND);
    }

    const { avgRating = 0, totalStudents = 0 } = studentsAndRating[0] || {};

    return courseDashboardDTO(totalStudents, avgRating, course, revenue[0]);
  }
  async getTrendingCourseGraph(
    courseId: string,
    filter?: filter,
    startDate?: string,
    endDate?: string,
  ): Promise<IChartTrendDTO[]> {
    const course_id = parseObjectId(courseId);
    console.log(courseId);
    if (!course_id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }

    let start: Date;
    let end: Date = new Date();

    switch (filter) {
      case "today":
        start = new Date();
        start.setHours(0, 0, 0, 0);
        break;

      case "Last Week":
        start = new Date();
        start.setDate(start.getDate() - 7);
        break;

      case "Last Month":
        start = new Date();
        start.setMonth(start.getMonth() - 1);
        break;

      case "Custom":
        start = new Date(startDate!);
        end = new Date(endDate!);
        break;

      default:
        start = new Date();
        start.setHours(0, 0, 0, 0);
    }
    const filterChart: chartFilter = {
      courseId: course_id,
      start: start,
      end: end,
    };

    const graph = await this._erolledRepository.getCourseEnrollmentTrend(
      course_id,
      filterChart,
    );
    return graph.map((data) => chartTrendDTO(data));
  }
}
