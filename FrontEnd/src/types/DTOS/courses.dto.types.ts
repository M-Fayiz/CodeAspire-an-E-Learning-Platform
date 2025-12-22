
export const COURSE_LEVEL = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
} as const;

export type CourseLevel = typeof COURSE_LEVEL[keyof typeof COURSE_LEVEL];

export const COURSE_STATUS = {
  IN_PROGRESS: "inProgress",
  DRAFT: "draft",
  PUBLISHED: "published",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type CourseStatus = typeof COURSE_STATUS[keyof typeof COURSE_STATUS];

export const LECTURE_TYPE = {
  VIDEO: "video",
  PDF: "pdf",
  NONE: "none",
} as const;

export type LectureType = typeof LECTURE_TYPE[keyof typeof LECTURE_TYPE];



export interface ISearchQuery {
  search?: string;
  category?: string;
  subCategory?: string;
  level?: CourseLevel;
  page?: number;
  limit?: number;
}

export interface SlotCourseDTO {
  _id: string;
  title: string;
}



export interface ILecture {
  _id?: string;
  title: string;
  lectureType: LectureType
  lectureContent: File | string;
}

export interface ISession {
  _id?: string;
  title: string;
  lectures: ILecture[];
}

export interface ICourseListDTO {
  _id: string;
  title: string;
  thumbnail?: string;
  category: string;
  subCategory: string;
  language: string;
  level:CourseLevel;
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
  level: CourseLevel
  price: number;
  mentorId: string;
  sessions: ISession[];
  status?: CourseStatus
}

// export interface IFormCourse {
//   _id: string;
//   title: string;
//   thumbnail: string;
//   categoryId: string;
//   subCategoryId: string;
//   language: string;
//   level: "Beginner" | "Intermediate" | "Advanced";
//   price: number;
//   mentorId: string;
//   sessions: ISession[];
//   description: string;
//   status: "inProgress" | "draft" | "published" | "rejected";
// }

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
  level:CourseLevel
  price: number;
  mentorId: {
    _id: string;
    name: string;
    email: string;
  };
  sessions: ISession[];
  description: string;
  status: CourseStatus
  updated: string;
  
}



export interface COurseDetaildWIthEnrolledData extends IFormCourseDTO{
  isEnrolled:boolean
  enrolledId:string
}


export type ILectureWithoutContent = Omit<
  ILecture,
  "lectureContent"
>;

export interface ISessionWithoutContent {
  title: string;
  lectures: ILectureWithoutContent[];
}

export interface ICourseDetailsPageDTO
  extends Omit<IFormCourseDTO, "sessions"> {
  sessions: ISessionWithoutContent[];
}



