import startCase from "lodash/startCase.js";
import { parseObjectId } from "../../mongoose/objectId";
import { ICategoryRepository } from "../../repository/interface/ICategoryRepository";
import { ICategoryService } from "../interface/ICategoryService";
import { ICategory } from "../../types/category.types";
import { createHttpError } from "../../utils/http-error";
import { HttpStatus } from "../../const/http-status";
import { HttpResponse } from "../../const/error-message";
import { ICaregoryTreeDTO } from "../../types/dtos.type/category.dto.types";

export class CategoryService implements ICategoryService {
  constructor(private _categoryRepository: ICategoryRepository) {}

  async createCategory(
    title: string,
    parent: string | null,
  ): Promise<ICategory | null> {
    const parentId = parent ? parseObjectId(parent) : null;
    const isExist = await this._categoryRepository.findCategory(title);
    if (isExist) {
      throw createHttpError(HttpStatus.CONFLICT, HttpResponse.ITEM_EXIST);
    }

    title = startCase(title);
    return await this._categoryRepository.createCategory(
      title,

      parentId,
    );
  }
  async listCategories(): Promise<ICaregoryTreeDTO[] | null> {
    const categories = await this._categoryRepository.listCategories();
    const map = new Map();
    categories?.forEach((cat) => {
      map.set(cat._id.toString(), {
        _id: cat._id.toString(),
        title: cat.title,
        parent: cat.parentId,
        children: [],
      });
    });

    const tree: ICaregoryTreeDTO[] = [];

    categories?.forEach((cat) => {
      const node = map.get(cat._id.toString());
      if (cat.parentId) {
        const parent = map.get(cat.parentId.toString());

        if (parent) {
          node.parent = parent._id;
          parent.children.push(node);
        }
      } else {
        tree.push(node);
      }
    });

    return tree;
  }
  async editCategory(
    categoryId: string,
    title: string,
    parentId: string | null,
  ): Promise<ICategory | null> {
    title = startCase(title);
    const category_Id = parseObjectId(categoryId);

    if (!category_Id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }

    const editedResult = await this._categoryRepository.editCategory(
      category_Id,
      title,
      parentId,
    );
    if (!editedResult) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.INVALID_CREDNTIALS,
      );
    }

    return editedResult;
  }
}
