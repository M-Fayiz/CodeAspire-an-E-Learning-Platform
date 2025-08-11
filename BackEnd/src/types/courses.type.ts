import { Document, Types } from "mongoose";

export interface ILecture {
  title: string;
  lectureType: "video" | "pdf";
  lecture: string;
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
  title: string;
  description?: string;
  thumbnail?: string;
  categoryId: Types.ObjectId | object;
  subCategoryId: Types.ObjectId | object;
  language: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  mentorsId: Types.ObjectId;
  sessions?: ISession[];
  isActive: boolean;
  isDraft: boolean;
  status:'inProgress' | 'draft' | 'published'

}

export type updatePart = "sessions" | "lecture" | "baseInformation";
