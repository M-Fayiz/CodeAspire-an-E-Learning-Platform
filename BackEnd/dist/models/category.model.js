"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const modelName_const_1 = require("../const/modelName.const");
const categorySchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    parentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: modelName_const_1.DbModelName.CATEGORY,
        default: null,
    },
});
exports.CategoryModel = mongoose_1.default.model(modelName_const_1.DbModelName.CATEGORY, categorySchema);
