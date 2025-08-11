import { Types } from "mongoose";
import { ICategory } from "../../types/category.types";

export interface ICategoryRepository {
  createCategory(
    title: string,
    slug: string,
    parentId: Types.ObjectId | null,
  ): Promise<ICategory | null>;
  listCategories(): Promise<ICategory[] | null>;
  findCategory(filter: string): Promise<ICategory | null>;
  editCategory(
    slug: string,
    title: string,
    parentId: string | null,
  ): Promise<ICategory | null>;
}
