"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const category_model_1 = require("../../models/category.model");
const baseRepository_1 = require("../baseRepository");
class CategoryRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(category_model_1.CategoryModel);
    }
    async createCategory(title, parentId) {
        return await this.create({ title, parentId });
    }
    async listCategories() {
        return await this.findAll();
    }
    async findCategory(filter) {
        return await this.findOne({ title: { $regex: filter, $options: "i" } });
    }
    async editCategory(categoryId, title, parentId) {
        return await this.findByIDAndUpdate(categoryId, { title, parentId });
    }
}
exports.CategoryRepository = CategoryRepository;
