import { Types } from "mongoose";
import { IEnrolledModel } from "../models/enrolled.model";
import { IFormCourseDTO } from "../types/dtos.type/course.dtos.type";
import {
  IEnrolledCoursedetailsDTO,
  IEnrolledListDto,
} from "../types/dtos.type/enrolled.dto.type";

export const enrolledListDTO = (
  enrolledData: IEnrolledModel,
): IEnrolledListDto => {
  return {
    _id: enrolledData._id,
    completedPercentage: enrolledData.progress?.completionPercentage ?? 0,
    course: enrolledData.courseId as IFormCourseDTO,
  };
};

export const enrolledCourseDetailDTO = (
  enrolledData: IEnrolledModel,
  CourseDetails: IFormCourseDTO,
): IEnrolledCoursedetailsDTO => {
  return {
    _id: enrolledData._id,
    completedPercentage: enrolledData.progress?.completionPercentage ?? 0,
    course: CourseDetails as IFormCourseDTO,
    courseId: enrolledData.courseId as Types.ObjectId,
    learnerId: enrolledData.learnerId,
    mentorId: enrolledData.mentorId,
    rating:enrolledData.rating??0,
    progress: enrolledData.progress ? enrolledData.progress : null,
    
  };
};
