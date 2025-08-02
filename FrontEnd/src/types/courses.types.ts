export interface ICourseData {
 title: string;
  description?: string;
  thumbnail?: string;
  categoryId:string;
  subCategoryId:string
  language: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  mentorsId: string
  sessions?:[
    { 
      name :string,
      lectures:[
        {
          name:string,
          lectureType:'video'|'image'|'pdf',
          lecture:string
        }
      ]
    }
  ]
  isActive: boolean;
  isDraft: boolean;
}
