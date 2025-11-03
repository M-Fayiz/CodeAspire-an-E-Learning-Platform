import {  ICategory } from "../../types/category.types";
import { ICaregoryTreeDTO } from "../../types/dtos.type/category.dto.types";

export interface ICategoryService {
  createCategory(
    title: string,
    parent: string | null,
  ): Promise<ICategory | null>;
  listCategories(): Promise<ICaregoryTreeDTO[] | null>;
  editCategory(
    slug: string,
    title: string,
    parentId: string | null,
  ): Promise<ICategory | null>;
}
