import { ICaregoryTree, ICategory } from "../../types/category.types";

export interface ICategoryService {
  createCategory(
    title: string,
    parent: string | null,
  ): Promise<ICategory | null>;
  listCategories(): Promise<ICaregoryTree[] | null>;
  editCategory(
    slug: string,
    title: string,
    parentId: string | null,
  ): Promise<ICategory | null>;
}
