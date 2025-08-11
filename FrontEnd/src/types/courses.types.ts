export interface  ILecture{
  title:string
  lectureType:'video'|'pdf'|'none',
  lecture:string;
}
export interface ISession{
  title:string;
  lectures:ILecture[];
  review?:{
    status:'pending'|'success'|'failed'|'draft'
    time:Date|null
  };
}


export interface ICourseData {
  id:string
 title: string;
  description?: string;
  thumbnail?: File|string;
  categoryId:string;
  subCategoryId:string
  language: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: string;
  mentorsId: string
  sessions?:ISession[];
  isActive: boolean;
  isDraft: boolean;
}
export interface ICourseListDTO {
    id:string
    title: string;
    thumbnail?: string;
    category:string
    subCategory:string
    language: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    price: number;
}
export interface ICourseDTO extends ICourseListDTO{
  sessions:ISession[],
  description:string
}


export interface CourseForm{
  title: string;
  description?: string;
  thumbnail?: File|string;
  categoryId:string;
  subCategoryId:string
  language: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: string;
  mentorsId: string
  sessions?:ISession[];
}
