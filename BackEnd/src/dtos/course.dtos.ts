import { Types } from "mongoose";
import { ICategory } from "../types/category.types";
import { ICourses } from "../types/courses.type";
import {
  ICourseDTO,
  ICourseListDTO,
  IPopulatedCourse,
  IFormCourseDTO,
} from "../types/dtos.type/course.dtos.type";


export function courseListDTO(
  course: IPopulatedCourse,
  enrolledIds?: Set<string>,
): ICourseListDTO {
  return {
    _id: course._id,
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
    isEnrolled: enrolledIds?.has(course._id as Types.ObjectId) ?? false,
  };
}

export function courseDTO(
  course: IPopulatedCourse,
  isEnrolled?: boolean,
): ICourseDTO {
  return {
    _id: course._id,
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
    isEnrolled: isEnrolled ? isEnrolled : false,
  };
}

export function formCourseDto(course: IPopulatedCourse): IFormCourseDTO {
  return {
    _id: course._id,
    title: course.title || "",
    description: course.description || "",
    thumbnail: course.thumbnail || "",
    category: {
      _id: course.categoryId._id,
      title: course.categoryId.title,
    },
    subCategory: {
      _id: course.subCategoryId._id,
      title: course.subCategoryId.title,
    },
    language: course.language,
    level: course.level,
    price: course.price,
    mentorsId: {
      _id: course.mentorsId._id,
      name: course.mentorsId.name,
      email: course.mentorsId.email,
    },
    sessions: course.sessions ?? [],
    status: course.status,
    updated: course.updatedAt.toISOString(),
  };
}
