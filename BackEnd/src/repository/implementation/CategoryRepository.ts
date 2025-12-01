import { Types } from "mongoose";
import { CategoryModel, ICategoryModel } from "../../models/category.model";
import { ICategory } from "../../types/category.types";
import { BaseRepository } from "../baseRepository";
import { ICategoryRepository } from "../interface/ICategoryRepository";

export class CategoryRepository
  extends BaseRepository<ICategoryModel>
  implements ICategoryRepository
{
  constructor() {
    super(CategoryModel);
  }

  async createCategory(
    title: string,
    parentId: Types.ObjectId | null,
  ): Promise<ICategoryModel | null> {
    return await this.create({ title, parentId });
  }
  async listCategories(): Promise<ICategoryModel[] | null> {
    return await this.findAll();
  }
  async findCategory(filter: string): Promise<ICategoryModel | null> {
    return await this.findOne({ title: { $regex: filter, $options: "i" } });
  }
  async editCategory(
    categoryId: Types.ObjectId,
    title: string,
    parentId: string,
  ): Promise<ICategoryModel | null> {
    return await this.findByIDAndUpdate(categoryId, { title, parentId });
  }
}
