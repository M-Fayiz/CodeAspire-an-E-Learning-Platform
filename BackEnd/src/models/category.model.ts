import mongoose, { Document, Types } from "mongoose";
import { ICategory } from "../types/category.types";
import { DbModelName } from "../const/modelName";

export interface ICategoryModel
  extends Document<Types.ObjectId>,
    Omit<ICategory, "_id"> {}

const categorySchema = new mongoose.Schema<ICategoryModel>({
  title: {
    type: String,
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: DbModelName.CATEGORY,
    default: null,
  },
});

export const CategoryModel = mongoose.model<ICategoryModel>(
  DbModelName.CATEGORY,
  categorySchema,
);
