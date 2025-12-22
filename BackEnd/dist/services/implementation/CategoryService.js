"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const startCase_js_1 = __importDefault(require("lodash/startCase.js"));
const objectId_1 = require("../../mongoose/objectId");
const http_error_1 = require("../../utils/http-error");
const http_status_const_1 = require("../../const/http-status.const");
const error_message_const_1 = require("../../const/error-message.const");
class CategoryService {
    constructor(_categoryRepository) {
        this._categoryRepository = _categoryRepository;
    }
    async createCategory(title, parent) {
        const parentId = parent ? (0, objectId_1.parseObjectId)(parent) : null;
        const isExist = await this._categoryRepository.findCategory(title);
        if (isExist) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.CONFLICT, error_message_const_1.HttpResponse.ITEM_EXIST);
        }
        title = (0, startCase_js_1.default)(title);
        return await this._categoryRepository.createCategory(title, parentId);
    }
    async listCategories() {
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
        const tree = [];
        categories?.forEach((cat) => {
            const node = map.get(cat._id.toString());
            if (cat.parentId) {
                const parent = map.get(cat.parentId.toString());
                if (parent) {
                    node.parent = parent._id;
                    parent.children.push(node);
                }
            }
            else {
                tree.push(node);
            }
        });
        return tree;
    }
    async editCategory(categoryId, title, parentId) {
        title = (0, startCase_js_1.default)(title);
        const category_Id = (0, objectId_1.parseObjectId)(categoryId);
        if (!category_Id) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_ID);
        }
        const editedResult = await this._categoryRepository.editCategory(category_Id, title, parentId);
        if (!editedResult) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_CREDNTIALS);
        }
        return editedResult;
    }
}
exports.CategoryService = CategoryService;
