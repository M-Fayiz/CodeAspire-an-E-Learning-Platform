"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const http_status_1 = require("../../const/http-status");
const error_message_1 = require("../../const/error-message");
const response_util_1 = require("../../utils/response.util");
class CategoryController {
    constructor(_categoryService) {
        this._categoryService = _categoryService;
        this.createCategory = async (req, res, next) => {
            try {
                const result = await this._categoryService.createCategory(req.body.title, req.body.parentId);
                res.status(http_status_1.HttpStatus.OK).json((0, response_util_1.successResponse)(error_message_1.HttpResponse.OK, result));
            }
            catch (error) {
                next(error);
            }
        };
        this.listCategories = async (req, res, next) => {
            try {
                const categories = await this._categoryService.listCategories();
                res
                    .status(http_status_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_1.HttpResponse.OK, { categories }));
            }
            catch (error) {
                next(error);
            }
        };
        this.editCategory = async (req, res, next) => {
            try {
                const { categoryId } = req.params;
                const { title, parentId } = req.body;
                const editedData = await this._categoryService.editCategory(categoryId, title, parentId);
                res
                    .status(http_status_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_1.HttpResponse.OK, { editedData }));
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.CategoryController = CategoryController;
