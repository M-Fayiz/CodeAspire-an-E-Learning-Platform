import { Types } from "mongoose";
import { ICourses, ISession } from "../courses.type";

export interface ICoursesPopulated extends ICourses {
  categoryId: { title: string };
  subCategoryId: { title: string };
}

export interface ICourseListDTO {
  _id: Types.ObjectId | string;
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
  _id: Types.ObjectId | string;
  title: string;
  thumbnail: string;
  category: {
    _id: string;
    title: string;
  };
  subCategory: {
    _id: string;
    title: string;
  };
  language: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  mentorsId: {
    _id: string;
    name: string;
    email: string;
  };
  sessions: ISession[];
  description: string;
  status: "inProgress" | "draft" | "published" | "approved" | "rejected";
  updated: string;
}
