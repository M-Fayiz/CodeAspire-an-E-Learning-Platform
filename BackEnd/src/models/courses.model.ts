import mongoose, { Schema, Types } from "mongoose";
import { ICourses } from "../types/courses.type"; 
import { string } from "zod";

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
  language: {
    type: String
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
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
      lectures:[Types.ObjectId]
    }
  ]
  
}, { timestamps: true });

export const courseModel=mongoose.model<ICourses>('courses',courseSchema)
