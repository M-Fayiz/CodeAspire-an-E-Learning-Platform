"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModel = exports.LearnerModel = exports.MentorModel = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_types_1 = require("../types/user.types");
const modelName_const_1 = require("../const/modelName.const");
const option = { discriminatorKey: "role", timestamps: true };
const BaseUserSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(user_types_1.IRole),
        required: true,
    },
    bio: String,
    phone: Number,
    password: String,
    profilePicture: String,
    googleId: { type: String },
    isActive: { type: Boolean, default: true },
    ApprovalStatus: {
        type: String,
        enum: ["pending", "approved", "rejected", "requested"],
        default: "pending",
    },
    isRequested: { type: Boolean, default: false },
}, option);
exports.UserModel = mongoose_1.default.model(modelName_const_1.DbModelName.USER, BaseUserSchema);
const MentorSchema = new mongoose_1.default.Schema({
    expertise: [String],
    yearsOfExperience: Number,
    mentorRating: Number,
    socialLinks: {
        linkedIn: String,
        github: String,
        portfolio: String,
    },
    resume: String,
});
exports.MentorModel = exports.UserModel.discriminator(user_types_1.IRole.Mentor, MentorSchema);
const LearnerSchema = new mongoose_1.default.Schema({
    learningStreak: {
        current: Number,
        longest: Number,
        lastLearningDate: Date
    },
    activeDates: {
        type: [Date],
        default: [],
    },
});
exports.LearnerModel = exports.UserModel.discriminator(user_types_1.IRole.Learner, LearnerSchema);
const AdminSchema = new mongoose_1.default.Schema({
    permissions: [String],
});
exports.AdminModel = exports.UserModel.discriminator(user_types_1.IRole.Admin, AdminSchema);
