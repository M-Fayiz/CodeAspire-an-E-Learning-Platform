"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrolleModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enrollment_types_1 = require("../types/enrollment.types");
const modelName_const_1 = require("../const/modelName.const");
const enrolledSchema = new mongoose_1.default.Schema({
    courseId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: modelName_const_1.DbModelName.COURSE,
        required: true,
    },
    categoryId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: modelName_const_1.DbModelName.CATEGORY,
    },
    learnerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: modelName_const_1.DbModelName.USER,
    },
    mentorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: modelName_const_1.DbModelName.USER,
    },
    createdAt: {
        type: Date,
    },
    progress: {
        completedLectures: [{ type: mongoose_1.default.Schema.ObjectId }],
        lastAccessedLecture: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            default: null,
        },
        lastAccessedSession: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            default: null,
        },
        completionPercentage: { type: Number, default: 0 },
    },
    courseStatus: {
        type: String,
        enum: Object.values(enrollment_types_1.completionStatus),
        default: enrollment_types_1.completionStatus.IN_PROGRESS,
    },
    rating: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
exports.EnrolleModel = mongoose_1.default.model(modelName_const_1.DbModelName.ENROLLMENT, enrolledSchema);
