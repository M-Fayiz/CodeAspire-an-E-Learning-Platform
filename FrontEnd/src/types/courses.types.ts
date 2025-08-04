export interface ICourseData {
 title: string;
  description?: string;
  thumbnail?: File|string;
  categoryId:string;
  subCategoryId:string
  language: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  mentorsId: string
  sessions?:[
    { 
      title :string,
      order:number
      lectures:[
        {
          title:string,
          lectureType:'video'|'image'|'pdf',
          lecture:string
        }
      ],
      review:false
    }
  ]
  isActive: boolean;
  isDraft: boolean;
}
