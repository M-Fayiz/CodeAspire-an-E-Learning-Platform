import { Document, Types } from "mongoose";

export interface ICourses extends Document {
  title: string;
  description?: string;
  thumbnail?: string;
  categoryId:Types.ObjectId;
  subCategoryId:Types.ObjectId
  language: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  mentorsId: Types.ObjectId;
  sessions?:[
    { 
      name :string,
      lectures:Types.ObjectId[]
    }
  ]
  isActive: boolean;
  isDraft: boolean;
}
