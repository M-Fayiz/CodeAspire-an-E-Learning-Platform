import mongoose, { Document, Types } from "mongoose";
import { IUser, IAdmin, ILearner, IMentor, IRole } from "../types/user.types";

const option = { discriminatorKey: "role", timeStamps: true };

export interface IUserModel
  extends Document<Types.ObjectId>,
    Omit<IUser, "_id"> {}
export interface IMenterModel
  extends Document<Types.ObjectId>,
    Omit<IMentor, "_id"> {}
export interface IAdminModel
  extends Document<Types.ObjectId>,
    Omit<IAdmin, "_id"> {}
export interface ILearnerModel
  extends Document<Types.ObjectId>,
    Omit<ILearner, "_id"> {}

const BaseUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: Number,
    password: String,
    profilePicture: String,
    googleId: { type: String },
    isActive: { type: Boolean, default: false },
    ApprovalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "requested"],
      default: "pending",
    },
    isRequested: { type: Boolean, default: false },
  },
  option,
);
export const UserModel = mongoose.model<IUserModel>("User", BaseUserSchema);

const MentorSchema = new mongoose.Schema({
  expertise: [String],
  bio: String,
  yearsOfExperience: Number,
  mentorRating: Number,
  socialLinks: {
    linkedIn: String,
    github: String,
    portfolio: String,
  },
  resume: String,
});
export const MentorModel = UserModel.discriminator<IMenterModel>(
  IRole.Mentor,
  MentorSchema,
);

const LearnerSchema = new mongoose.Schema({
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});
export const LearnerModel = UserModel.discriminator<ILearnerModel>(
  IRole.Learner,
  LearnerSchema,
);

const AdminSchema = new mongoose.Schema({
  permissions: [String],
});
export const AdminModel = UserModel.discriminator<IAdminModel>(
  IRole.Admin,
  AdminSchema,
);

export interface IMappedUser {
  id: Types.ObjectId;
  name: string;
  email: string;
  role: string;
  profile?: string;
  isApproved?: boolean;
  isRequested?: boolean;
}
export interface IPayload {
  id: Types.ObjectId;
  name?: string;
  email: string;
  role: IRole;
  ApprovalStatus?: "pending" | "approved" | "rejected" | "requested";
  isRequested?: boolean;
}
