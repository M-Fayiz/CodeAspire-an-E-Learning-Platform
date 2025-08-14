import { title } from "process";
import {
  ICourseDTO,
  ICourseListDTO,
  ICoursesPopulated,
} from "../types/dtos.type/course.dtos.type";
import { ISession } from "../types/courses.type";

export function courseListDTO(course: ICoursesPopulated): ICourseListDTO {
  return {
    id: course.id as string,
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


export function courseDTO(course:ICoursesPopulated):ICourseDTO{
  return{
    id: course.id as string,
    title: course.title,
    description:course.description?course.description:'',
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
    sessions:course.sessions?course.sessions:null
  }
}