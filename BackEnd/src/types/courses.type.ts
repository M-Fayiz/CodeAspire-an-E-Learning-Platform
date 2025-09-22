import { Document, Types } from "mongoose";
import { IMenterModel } from "../models/user.model";

export interface ILecture {
  _id?: Types.ObjectId;
  title: string;
  lectureType: "video" | "pdf";
  lectureContent: string;
}
export interface ISession {
  title: string;
  lectures: ILecture[];
  review: {
    status: "pending" | "success" | "failed";
    time: Date;
  };
}
export interface ICourses extends Document {
  id?: string;
  title: string;
  description?: string;
  thumbnail?: string;
  categoryId: Types.ObjectId | object;
  subCategoryId: Types.ObjectId | object;
  language: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  mentorsId: Types.ObjectId | IMenterModel;
  sessions?: ISession[];
  isActive?: boolean;
  isDraft?: boolean;
  status: "inProgress" | "draft" | "published" | "approved" | "rejected";
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
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  mentorsId: string;
  sessions: ISession[];
  updatedAt: string;
  status: "inProgress" | "draft" | "published" | "approved" | "rejected";
}
