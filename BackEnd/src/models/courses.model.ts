import mongoose from "mongoose";
import { ICourses } from "../types/courses.type";
import { DbModelName } from "../const/modelName";

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
      ref: DbModelName.CATEGORY,
      required: true,
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DbModelName.CATEGORY,
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
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DbModelName.USER,
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
      },
    ],
    status: {
      type: String,
      enum: ["inProgress", "draft", "published", "approved", "rejected"],
      default: "draft",
    },
  },
  { timestamps: true },
);

export const courseModel = mongoose.model<ICourses>(
  DbModelName.COURSE,
  courseSchema,
);
