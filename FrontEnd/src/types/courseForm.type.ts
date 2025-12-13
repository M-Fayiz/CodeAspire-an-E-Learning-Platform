import type { ISession } from "./DTOS/courses.dto.types";

export interface IBaseCourse {
  title: string;
  description: string;
  price: number;
  thumbnail: string | File;
  level: "Beginner" | "Intermediate" | "Advanced";
  language: string;
  categoryId: string;
  subCategoryId: string;
  mentorId: string;
}
export interface ICourseCreateForm extends IBaseCourse {
  _id: string;
  sessions: ISession[];
}
