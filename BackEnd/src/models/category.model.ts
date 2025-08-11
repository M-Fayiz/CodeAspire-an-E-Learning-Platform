import mongoose from "mongoose";
import { ICategory } from "../types/category.types";

const categorySchema = new mongoose.Schema<ICategory>({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
});

export const CategoryModel = mongoose.model<ICategory>(
  "Category",
  categorySchema,
);
