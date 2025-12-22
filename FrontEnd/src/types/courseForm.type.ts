import type { CourseLevel, ISession } from "./DTOS/courses.dto.types";

export interface ICourseData {
  _id?: string;
  title: string;
  description?: string;
  thumbnail?: File | string;
  categoryId: string;
  subCategoryId?: string;
  language: string;
  level:CourseLevel
  price: number;
  mentorId: string;
  sessions?: ISession[];
  isActive?: boolean;
  isDraft?: boolean;
  isEnrolled?: boolean;
}