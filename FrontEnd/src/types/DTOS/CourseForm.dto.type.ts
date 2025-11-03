import type { CourseForm, IFormCourseDTO } from "./courses.dto.types";

export function CourseFormDTO(course: IFormCourseDTO): CourseForm {
  return {
    _id: course._id,
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail,
    categoryId: course.category._id,
    subCategoryId: course.category._id,
    language: course.language,
    level: course.level,
    price: Number(course.price),
    mentorsId: course.mentorsId._id,
    sessions: course.sessions || [],
    status: course.status,
  };
}
