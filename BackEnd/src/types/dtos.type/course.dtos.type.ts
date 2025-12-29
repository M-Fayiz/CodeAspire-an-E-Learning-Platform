import { Types } from "mongoose";
import { CourseLevel, CourseStatus, ILecture, ISession } from "../courses.type";
import { ICategory } from "../category.types";
import { IMenterModel } from "../../models/user.model";
import { ICategoryModel } from "../../models/category.model";
import { IReviewDTO } from "./review.dto.types";

export interface IBaseCourse {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  thumbnail?: string;
  language: string;
  level: CourseLevel;
  price: number;

  subCategoryId: ICategory;
  sessions?: ISession[];
  isActive?: boolean;
  isDraft?: boolean;
  status: CourseStatus;
  updatedAt: Date;
}

export interface IPopulatedCourse extends IBaseCourse {
  categoryId: ICategoryModel;
  subCategoryId: ICategoryModel;
  mentorId: IMenterModel;
}

export interface ICourseListDTO {
  _id: Types.ObjectId;
  title: string;
  thumbnail?: string;
  category: string;
  subCategory: string;
  language: string;
  level: CourseLevel;
  price: number;
  isEnrolled: boolean;
}

export interface ICourseDTO extends ICourseListDTO {
  sessions: ISession[] | null;
  description: string;
}

export interface IFormCourseDTO {
  _id: Types.ObjectId;
  title: string;
  thumbnail: string;
  category: {
    _id: Types.ObjectId;
    title: string;
  };
  subCategory: {
    _id: Types.ObjectId;
    title: string;
  };
  language: string;
  level: CourseLevel;
  price: number;
  mentorId: {
    _id: Types.ObjectId;
    name: string;
    email: string;
  };
  sessions: ISession[];
  description: string;
  status: CourseStatus;
  updated: string;
}

export interface IListCourseSlot {
  _id: Types.ObjectId;
  title: string;
}

export interface IBaseFormCourse {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  status: CourseStatus;
  level: CourseLevel;
  language: string;
  categoryId: Types.ObjectId;
  subCategoryId: Types.ObjectId;
  mentorId: Types.ObjectId;
}
export interface ICourseCreateForm extends IBaseFormCourse {
  _id: Types.ObjectId;
  sessions: ISession[];
}

export type ILectureWithoutContent = Omit<ILecture, "lectureContent">;

export interface ISessionWithoutContent {
  title: string;
  lectures: ILectureWithoutContent[];
}

export interface ICourseDetailsPageDTO
  extends Omit<IFormCourseDTO, "sessions"> {
  sessions: ISessionWithoutContent[];
  avgRating: number;
  enrolledStd: number;
  courseReviews: IReviewDTO[];
}
