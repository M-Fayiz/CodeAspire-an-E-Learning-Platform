import { Document, Types } from "mongoose";

export interface ICourses extends Document {
  title: string;
  description?: string;
  thumbnail?: string;
  categoryId: Types.ObjectId;
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  mentorsId: Types.ObjectId;
  sessions:[
    { 
      name :string,
      lectures:Types.ObjectId[]
    }
  ]
  isActive: boolean;
  isDraft: boolean;
}
