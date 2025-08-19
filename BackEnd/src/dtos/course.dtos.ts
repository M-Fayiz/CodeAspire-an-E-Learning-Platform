import { ICourses } from "../types/courses.type";
import {
  ICourseDTO,
  ICourseListDTO,
  ICoursesPopulated,
  IFormCourseDTO,
} from "../types/dtos.type/course.dtos.type";

export function courseListDTO(course: ICoursesPopulated): ICourseListDTO {
  return {
    _id: course.id as string,
    title: course.title,
    thumbnail: course.thumbnail,
    category:
      typeof course.categoryId == "object" && "title" in course.categoryId
        ? course.categoryId.title
        : "",
    subCategory:
      typeof course.subCategoryId == "object" && "title" in course.subCategoryId
        ? course.subCategoryId.title
        : "",
    language: course.language,
    level: course.level,
    price: course.price,
  };
}

export function courseDTO(course: ICoursesPopulated): ICourseDTO {
  return {
    _id: course._id as string,
    title: course.title,
    description: course.description ? course.description : "",
    thumbnail: course.thumbnail,
    category:
      typeof course.categoryId == "object" && "title" in course.categoryId
        ? course.categoryId.title
        : "",
    subCategory:
      typeof course.subCategoryId == "object" && "title" in course.subCategoryId
        ? course.subCategoryId.title
        : "",
    language: course.language,
    level: course.level,
    price: course.price,
    sessions: course.sessions ? course.sessions : null,
  };
}

export function formCourseDto(course: ICourses): IFormCourseDTO {
  return {
    _id: String(course._id),
    title: course.title || "",
    description: course.description || "",
    thumbnail: course.thumbnail || "",
    categoryId: String(course.categoryId),
    subCategoryId: String(course.subCategoryId),
    language: course.language,
    level: course.level,
    price: course.price,
    mentorsId: String(course.mentorsId),
    sessions: course.sessions ?? [],
    status: course.status,
  };
}
