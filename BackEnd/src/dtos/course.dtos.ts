import { ICategory } from "../types/category.types";
import { ICourses } from "../types/courses.type";
import {
  ICourseDTO,
  ICourseListDTO,
  ICoursesPopulated,
  IFormCourseDTO,
} from "../types/dtos.type/course.dtos.type";
import { IUser } from "../types/user.types";

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
    category: {
      _id: String((course.categoryId as ICategory)._id),
      title: (course.categoryId as ICategory).title,
    },
    subCategory: {
      _id: String((course.subCategoryId as ICategory)._id),
      title: (course.subCategoryId as ICategory).title,
    },
    language: course.language,
    level: course.level,
    price: course.price,
    mentorsId: {
      _id: String((course.mentorsId as IUser)._id),
      name: (course.mentorsId as IUser).name,
      email: (course.mentorsId as IUser).email,
    },
    sessions: course.sessions ?? [],
    status: course.status,
    updated: course.updatedAt.toISOString(),
  };
}
