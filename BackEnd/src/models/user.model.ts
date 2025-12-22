
import mongoose, { Document, Types } from "mongoose";
import { IUser, IAdmin, ILearner, IMentor, IRole, mentorApprovalStatus } from "../types/user.types";
import { DbModelName } from "../const/modelName.const";

const option = { discriminatorKey: "role", timestamps: true };

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
export const UserModel = mongoose.model<IUserModel>(
  DbModelName.USER,
  BaseUserSchema,
);

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
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: DbModelName.COURSE }],
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
  ApprovalStatus?:mentorApprovalStatus
  isRequested?: boolean;
}
