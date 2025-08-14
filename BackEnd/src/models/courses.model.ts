import mongoose from "mongoose";
import { ICourses } from "../types/courses.type";
import { string } from "zod";

const courseSchema = new mongoose.Schema<ICourses>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    language: {
      type: String,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    price: {
      type: Number,
    },
    mentorsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isDraft: {
      type: Boolean,
      default: false,
    },
    sessions: [
      {
        title: {
          type: String,
        },
        order: Number,
        lectures: [
          {
            title: {
              type: String,
            },
            lectureType: {
              type: String,
              enum: ["video", "pdf", "audio"],
            },
            lectureContent: String,
          },
        ],
        review: {
          status: {
            type: String,
            enum: ["pending", "success", "failed"],
            time: Date,
          },
        },
      },
    ],
    status:{
      type:String,
      enum:['inProgress' , 'draft' , 'published']
    }
  },
  { timestamps: true },
);

export const courseModel = mongoose.model<ICourses>("courses", courseSchema);
