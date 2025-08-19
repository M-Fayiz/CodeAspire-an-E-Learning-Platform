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
  review?: {
    status: "pending" | "success" | "failed" | "draft";
    time: Date | null;
  };
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
  price: string;
  mentorsId: string;
  sessions?: ISession[];
  isActive?: boolean;
  isDraft?: boolean;
}
export interface ICourseListDTO {
  id: string;
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
  price: string;
  mentorsId: string;
  sessions?: ISession[];
  status?: "inProgress" | "draft" | "published";
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
  mentorsId: string;
  sessions: ISession[];
  description: string;
  status: "inProgress" | "draft" | "published";
}
