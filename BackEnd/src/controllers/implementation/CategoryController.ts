import { Request, Response, NextFunction } from "express";
import { ICategoryController } from "../interface/ICategoryController";
import { ICategoryService } from "../../services/interface/ICategoryService";
import { HttpStatus } from "../../const/http-status";
import { HttpResponse } from "../../const/error-message";
import { successResponse } from "../../utility/response.util";

export class CategoryController implements ICategoryController {
  constructor(private _categoryService: ICategoryService) {}

  createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this._categoryService.createCategory(
        req.body.title,
        req.body.parentId,
      );
      res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK, result));
    } catch (error) {
      next(error);
    }
  };
  listCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const categories = await this._categoryService.listCategories();

      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { categories }));
    } catch (error) {
      next(error);
    }
  };
  editCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const slug = req.params.id;
      let { title, parentId } = req.body;
      if (!parentId) parentId = null;
      const editedData = await this._categoryService.editCategory(
        slug,
        title,
        parentId,
      );
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { editedData }));
    } catch (error) {
      next(error);
    }
  };
}
