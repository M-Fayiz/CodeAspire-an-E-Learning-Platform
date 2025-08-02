import mongoose, { Schema, Types } from "mongoose";
import { ICourses } from "../types/courses.type"; 

const courseSchema = new mongoose.Schema<ICourses>({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  thumbnail: {
    type: String
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories', 
    required: true
  },
  subCategoryId:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'categories'
    
  },
  language: {
    type: String
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  price: {
    type: Number
  },
  mentorsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users' 
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isDraft: {
    type: Boolean,
    default: false
  },
  sessions:[
    {
      name:String,
      order:Number,
      lectures:[
        {
          name:String,
          lectureType:{
            type:String,
            enum:['video','pdf','audio']
          },
          lecture:String
        }
      ],
      review:{
        type:Boolean,
        default:false
      }
    }
  ]
  
}, { timestamps: true });

export const courseModel=mongoose.model<ICourses>('courses',courseSchema)
