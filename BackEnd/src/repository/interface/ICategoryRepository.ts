import { Types } from "mongoose";

import { ICategoryModel } from "../../models/category.model";

export interface ICategoryRepository {
  createCategory(
    title: string,

    parentId: Types.ObjectId | null,
  ): Promise<ICategoryModel | null>;
  listCategories(): Promise<ICategoryModel[] | null>;
  findCategory(filter: string): Promise<ICategoryModel | null>;
  editCategory(
    category_Id: Types.ObjectId,
    title: string,
    parentId: string | null,
  ): Promise<ICategoryModel | null>;
}
