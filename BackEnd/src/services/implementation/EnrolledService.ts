import { Types } from "mongoose";
import { HttpResponse } from "../../const/error-message";
import { HttpStatus } from "../../const/http-status";
import { parseObjectId } from "../../mongoose/objectId";
import { ICourseRepository } from "../../repository/interface/ICourseRepository";
import { IEnrolledRepository } from "../../repository/interface/IEnrolledRepositoy";
import { IFormCourseDTO } from "../../types/dtos.type/course.dtos.type";
import { createHttpError } from "../../utility/http-error";
import { formCourseDto } from "../../dtos/course.dtos";
import type { IEnrolledListDto } from "../../types/dtos.type/enrolled.dto.type";
import { enrolledListDTO } from "../../dtos/enrolled.dto";
import { IEnrolledModel } from "../../models/enrolled.model";
import { IEnrolledService } from "../interface/IEnrolledService";

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

    return populatedEnrolledCourse.map((course) =>
      enrolledListDTO(course as IEnrolledModel),
    );
  }
}
