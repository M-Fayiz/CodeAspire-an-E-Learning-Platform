import { Document, Types } from "mongoose";
import { IMenterModel } from "../models/user.model";


export enum LectureType {
  VIDEO = "video",
  PDF = "pdf",
}

export enum CourseLevel {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
}

export enum CourseStatus {
  IN_PROGRESS = "inProgress",
  DRAFT = "draft",
  PUBLISHED = "published",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum UpdatePart {
  SESSIONS = "sessions",
  LECTURE = "lecture",
  BASE_INFORMATION = "baseInformation",
}

export interface ILecture {
  _id?: Types.ObjectId;
  title: string;
  lectureType: LectureType;
  lectureContent: string;
}


export interface ISession {
  title: string;
  lectures: ILecture[];
}


export interface ICourses extends Document {
  id?: string;
  title: string;
  description?: string;
  thumbnail?: string;
  categoryId: Types.ObjectId;
  subCategoryId: Types.ObjectId;
  language: string;
  level:CourseLevel
  price: number;
  mentorId: Types.ObjectId | IMenterModel;
  sessions?: ISession[];
  isActive?: boolean;
  isDraft?: boolean;
  status: CourseStatus
  updatedAt: Date;
}

export type updatePart = "sessions" | "lecture" | "baseInformation";

export interface populatedCours {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  categoryId: {
    _id: string;
    title: string;
    slug: string;
    parentId: boolean | string;
  };
  subCategoryId: {
    _id: string;
    title: string;
    slug: string;
    parentId: boolean | string;
  };
  language: string;
  level: CourseLevel
  price: number;
  mentorId: string;
  sessions: ISession[];
  updatedAt: string;
  status: CourseStatus
}
