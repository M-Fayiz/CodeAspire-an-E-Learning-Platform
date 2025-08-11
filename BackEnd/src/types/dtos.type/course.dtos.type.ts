import { Types } from "mongoose";
import { ICourses, ISession } from "../courses.type";

export interface ICoursesPopulated extends ICourses {
  categoryId: { title: string };
  subCategoryId: { title: string };
}

export interface ICourseListDTO {
  id: Types.ObjectId;
  title: string;
  thumbnail?: string;
  category: string;
  subCategory: string;
  language: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
}

export interface ICourseDTO extends ICourseListDTO{
  sessions:ISession[]|null
  description:string
}
