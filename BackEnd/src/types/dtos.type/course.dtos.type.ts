import { Types } from "mongoose";
import { ICourses, ISession } from "../courses.type";
import { ICategory } from "../category.types";
import { IMenterModel } from "../../models/user.model";

export interface IBaseCourse {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  thumbnail?: string;
  language: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  sessions?: ISession[];
  isActive?: boolean;
  isDraft?: boolean;
  status: "inProgress" | "draft" | "published" | "approved" | "rejected";
  updatedAt: Date;
}

export interface IPopulatedCourse extends IBaseCourse {
  categoryId: ICategory;
  subCategoryId: ICategory;
  mentorsId: IMenterModel;
}

export interface ICourseListDTO {
  _id: Types.ObjectId;
  title: string;
  thumbnail?: string;
  category: string;
  subCategory: string;
  language: string;
  level: "Beginner" | "Intermediate" | "Advanced";
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
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  mentorsId: {
    _id: Types.ObjectId;
    name: string;
    email: string;
  };
  sessions: ISession[];
  description: string;
  status: "inProgress" | "draft" | "published" | "approved" | "rejected";
  updated: string;
}

export interface IListCourseSlot {
  _id: Types.ObjectId;
  title: string;
}
