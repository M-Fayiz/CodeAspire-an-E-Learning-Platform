import { FilterQuery, Types } from "mongoose";
import { HttpResponse } from "../../const/error-message";
import { HttpStatus } from "../../const/http-status";
import { parseObjectId } from "../../mongoose/objectId";
import { ICourseRepository } from "../../repository/interface/ICourseRepository";
import { IEnrolledRepository } from "../../repository/interface/IEnrolledRepositoy";
import {
  IFormCourseDTO,
  IPopulatedCourse,
} from "../../types/dtos.type/course.dtos.type";
import { createHttpError } from "../../utils/http-error";
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

import {
  chartFilter,
  completionStatus,
  filter,
  IProgressTrack,
} from "../../types/enrollment.types";
import type {
  CourseDashboardDTO,
  IChartTrendDTO,
} from "../../types/dtos.type/courseDashboard.dto.type";
import { ITransactionRepository } from "../../repository/interface/ITransactionRepository";
import {
  chartTrendDTO,
  courseDashboardDTO,
} from "../../dtos/courseDashboard.dto";
import { IMentorDhasboardDTO } from "../../types/dtos.type/mentorDashboard.dto.type";
import { mentorDashboardDTO } from "../../dtos/mentorDashboard.dto";
import { timeFilter } from "../../utils/dashFilterGenerator.utils";
import { ITransactionModel } from "../../models/transaction.model";
import { TransactionType } from "../../const/transaction";
import { graphPrps } from "../../types/adminDahsboard.type";
import { buildDateFilter } from "../../utils/dateBuilder";
import { IUserRepo } from "../../repository/interface/IUserRepo";
import { ISession } from "../../types/courses.type";
import { ICertificateRepository } from "../../repository/interface/ICertificateRepository";
import { ISlotBookingRepository } from "../../repository/interface/ISlotBookingRepository";
import { learnerDashboardCardsDTO } from "../../types/dtos.type/learnerDashboard.dto.type";
import { learnerDashboardDetails } from "../../dtos/learnerDashnoard.dto";

export class EnrolledService implements IEnrolledService {
  constructor(
    private _erolledRepository: IEnrolledRepository,
    private _courseRepository: ICourseRepository,
    private _transactionRepository: ITransactionRepository,
    private _userRepository: IUserRepo,
    private _certificateRepository:ICertificateRepository,
    private _slotbookingRepository:ISlotBookingRepository
    
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

        const populatedCourse = formCourseDto(data as IPopulatedCourse);

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

    const populatedCourse = formCourseDto(courseData as IPopulatedCourse);
    return enrolledCourseDetailDTO(enrolledData, populatedCourse);
  }
  async updatedProgress(
  enrolledId: string,
  lectureId: string,
  lastSession:string
): Promise<IProgressTrack | null> {

  const enrolledObjectId = parseObjectId(enrolledId);
  const lectureObjectId = parseObjectId(lectureId);
  const lastSession_id=parseObjectId(lastSession)

  if (!enrolledObjectId || !lectureObjectId) {
    throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
  }

  // atomic add (no duplicates)
  const updatedEnrollment =
    await this._erolledRepository.updateEnrolledData(
      enrolledObjectId,
      {
        $addToSet: { "progress.completedLectures": lectureObjectId },
        $set: { 
          "progress.lastAccessedLecture": lectureObjectId ,
          "progress.lastAccessedSession": lastSession_id ,
        },
      
      },
    );

  if (!updatedEnrollment) {
    throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ITEM_NOT_FOUND);
  }
  const course=await this._courseRepository.getCourse(updatedEnrollment.courseId as Types.ObjectId)
  
  let totalLectures=0

  for(let session of course?.sessions as ISession[]){
    totalLectures+=session.lectures.length
  }
 
  const completedCount =
    updatedEnrollment.progress.completedLectures.length;

   const completionPercentage =
    (completedCount / totalLectures! ) * 100;

  const status =
    completionPercentage === 100
      ? completionStatus.COMPLETED
      : completionStatus.IN_PROGRESS;

  const finalEnrollment =
    await this._erolledRepository.updateEnrolledData(
      enrolledObjectId,
      {
        $set: {
          "progress.completionPercentage": completionPercentage,
          courseStatus: status,
          
        },
      },
    );
   
  return finalEnrollment?.progress ?? null;
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
      this._transactionRepository.getCourseDashboardRevenue(course_id),
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

    if (!course_id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }

    let { start, end } = timeFilter(filter, startDate, endDate);

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
  async getMentorDashboardData(mentorId: string): Promise<IMentorDhasboardDTO> {
    const mentor_id = parseObjectId(mentorId);
    if (!mentor_id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }

    const [studentsAndRating, topCourse, revanue] = await Promise.all([
      this._erolledRepository.getMentorDashboardData(mentor_id),
      this._erolledRepository.getTopSellingCourse(mentor_id),
      this._transactionRepository.getMentorTotalRevenue(mentor_id),
    ]);
    return mentorDashboardDTO(studentsAndRating[0], topCourse, revanue);
  }
  async getRevenueGraph(
    filter: string,
    mentorId?: string,
  ): Promise<{
    slotRevanue: graphPrps[];
    courseRevanue: graphPrps[];
    signedUsers: graphPrps[];
  }> {
    const dateMatch = buildDateFilter(filter);

    const matchStage: FilterQuery<ITransactionModel> = {
      ...dateMatch,
    };

    if (mentorId) {
      const mentor_id = parseObjectId(mentorId);
      if (!mentor_id) {
        throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
      }
      matchStage.mentorId = mentor_id;
    }

    const slotRevenue =
      await this._transactionRepository.getMentorRevanueONSlot({
        ...matchStage,
        paymentType: TransactionType.SLOT_BOOKING,
      });

    const courseRevenue =
      await this._transactionRepository.getMentorRevanueONCourse({
        ...matchStage,
        paymentType: TransactionType.COURSE_PURCHASE,
      });

    const signedUsers = await this._userRepository.SignedUsers(dateMatch);

    return {
      slotRevanue: slotRevenue,
      courseRevanue: courseRevenue,
      signedUsers,
    };
  }
  async learnerDashboardCardData(learnerId: string, filter?: string, startDate?: string, endDate?: string): Promise<learnerDashboardCardsDTO> {
    const learner_Id=parseObjectId(learnerId)
    if(!learner_Id){
      throw createHttpError(HttpStatus.BAD_REQUEST,HttpResponse.INVALID_ID)
    }


    const[courseCard,certificateCount,slotCard]=await Promise.all([this._erolledRepository.getLearnerDashboardCourseData(learner_Id),this._certificateRepository.learnerTotalCertificate(learner_Id),this._slotbookingRepository.learnerDashboardSlotCard(learner_Id)]) 
    // console.log('course :',courseCard)
    // console.log('certificate :',certificateCount)
    // console.log('slot :',slotCard)
    return learnerDashboardDetails(courseCard[0],slotCard[0],certificateCount)
  }
}
