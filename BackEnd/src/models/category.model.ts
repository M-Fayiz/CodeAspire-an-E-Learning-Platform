import mongoose, { Document, Types } from "mongoose";
import { ICategory } from "../types/category.types";
import { DbModelName } from "../const/modelName.const";

export interface ICategoryModel extends ICategory, Document {
  _id: Types.ObjectId;
}
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
