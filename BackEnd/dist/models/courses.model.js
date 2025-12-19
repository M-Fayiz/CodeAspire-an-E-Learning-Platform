"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const modelName_1 = require("../const/modelName");
const courseSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    thumbnail: {
        type: String,
    },
    categoryId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: modelName_1.DbModelName.CATEGORY,
        required: true,
    },
    subCategoryId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: modelName_1.DbModelName.CATEGORY,
    },
    language: {
        type: String,
    },
    level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
    },
    price: {
        type: Number,
    },
    mentorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: modelName_1.DbModelName.USER,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    isDraft: {
        type: Boolean,
        default: false,
    },
    sessions: [
        {
            title: {
                type: String,
            },
            order: Number,
            lectures: [
                {
                    title: {
                        type: String,
                    },
                    lectureType: {
                        type: String,
                        enum: ["video", "pdf", "audio"],
                    },
                    lectureContent: String,
                },
            ],
        },
    ],
    status: {
        type: String,
        enum: ["inProgress", "draft", "published", "approved", "rejected"],
        default: "draft",
    },
}, { timestamps: true });
exports.courseModel = mongoose_1.default.model(modelName_1.DbModelName.COURSE, courseSchema);
