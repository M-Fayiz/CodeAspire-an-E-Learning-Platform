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
  ICourseProgess,
  IEnrolledCoursedetailsDTO,
  IEnrolledListDto,
  ILectureProgress,
  ISessionProgress,
} from "../../types/dtos.type/enrolled.dto.type";
import {
  enrolledCourseDetailDTO,
  enrolledListDTO,
} from "../../dtos/enrolled.dto";
import { IEnrolledModel } from "../../models/enrolled.model";
import { IEnrolledService } from "../interface/IEnrolledService";
import { ICourses } from "../../types/courses.type";
import { IProgressTrack } from "../../types/enrollment.types";

export class EnrolledService implements IEnrolledService {
  constructor(
    private _erolledRepository: IEnrolledRepository,
    private _courseRepository: ICourseRepository,
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

    // console.log("populated", populatedEnrolledCourse);
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
    const lecture_id = parseObjectId(lecture );

    if (!enrolled_id || !lecture_id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }
  
    const enrolledData = await this._erolledRepository.updatedProgress(
      enrolled_id,
      lecture_id
    );
    if (!enroledId) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ITEM_NOT_FOUND);
    }

    return enrolledData?.progress ?? null;
  }
}
