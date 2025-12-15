"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const modelName_1 = require("../const/modelName");
const reviewSchema = new mongoose_1.default.Schema({
    courseId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: modelName_1.DbModelName.COURSE,
        required: true,
    },
    learnerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: modelName_1.DbModelName.USER,
        required: true,
    },
    comment: {
        type: String,
        required: false,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    replies: {
        mentorId: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: modelName_1.DbModelName.USER,
        },
        comment: String,
    },
}, { timestamps: true });
const ReviewModel = mongoose_1.default.model(modelName_1.DbModelName.REVIEW, reviewSchema);
exports.default = ReviewModel;
