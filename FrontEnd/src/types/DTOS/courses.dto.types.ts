export interface ILecture {
  _id?: string;
  title: string;
  lectureType: "video" | "pdf" | "none";
  lectureContent: File | string;
}
export interface ISession {
  _id?: string;
  title: string;
  lectures: ILecture[];
}

export interface ICourseData {
  _id?: string;
  title: string;
  description?: string;
  thumbnail?: File | string;
  categoryId: string;
  subCategoryId?: string;
  language: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  mentorId: string;
  sessions?: ISession[];
  isActive?: boolean;
  isDraft?: boolean;
  isEnrolled?: boolean;
}
export interface ICourseListDTO {
  _id: string;
  title: string;
  thumbnail?: string;
  category: string;
  subCategory: string;
  language: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
}
export interface ICourseDTO extends ICourseListDTO {
  sessions: ISession[];
  description: string;
}

export interface CourseForm {
  _id?: string;
  title: string;
  description?: string;
  thumbnail?: File | string;
  categoryId: string;
  subCategoryId?: string;
  language: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  mentorId: string;
  sessions: ISession[];
  status?: "inProgress" | "draft" | "published" | "approved" | "rejected";
}

export interface IFormCourse {
  _id: string;
  title: string;
  thumbnail: string;
  categoryId: string;
  subCategoryId: string;
  language: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  mentorId: string;
  sessions: ISession[];
  description: string;
  status: "inProgress" | "draft" | "published" | "rejected";
}

export interface IFormCourseDTO {
  _id: string;
  title: string;
  thumbnail: string;
  category: {
    _id: string;
    title: string;
  };
  subCategory: {
    _id: string;
    title: string;
  };
  language: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  mentorId: {
    _id: string;
    name: string;
    email: string;
  };
  sessions: ISession[];
  description: string;
  status: "inProgress" | "draft" | "published" | "approved" | "rejected";
  updated: string;
  isEnrolled?: boolean;
}

export interface ISearchQuery {
  search?: string;
  category?: string;
  subcategory?: string;
  level?: string;
  page?: number;
  limit?: number;
}

export interface SlotCourseDTO {
  _id: string;
  title: string;
}
