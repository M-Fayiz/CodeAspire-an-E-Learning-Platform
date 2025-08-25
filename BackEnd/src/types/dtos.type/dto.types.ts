import { Types } from "mongoose";
import { mentorApprovalStatus } from "../user.types";

export interface IBaseRoleDTO {
  id: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  role: "mentor" | "learner" | "admin";
  profilePicture?: string;
  isActive: boolean;
  bio?: string;
  ApprovalStatus: mentorApprovalStatus;
}

export interface IMentorDTO extends IBaseRoleDTO {
  expertise?: string[];
  socialLinks?: object;
  mentorRating?: number;
  resume?: string;
  ApprovalStatus: mentorApprovalStatus;
  isRequested?: boolean;
}

export interface ILearnerDTO extends IBaseRoleDTO {
  enrolledCourses?: Types.ObjectId[];
}

export interface IAdminDTO extends IBaseRoleDTO {}

export interface IUserDTO {
  id: Types.ObjectId;
  name?: string;
  email: string;
  profile: string | undefined;
  role: "learner" | "admin" | "mentor";
  ApprovalStatus?: mentorApprovalStatus;
  isRequested?: boolean;
}

export interface ICategoryDTO {
  _id: string;
  title: string;
  slug:string
  parentId: string | null;
  children?: ICategoryDTO[];
}

export interface IPayloadDTO {
  _id: Types.ObjectId;
  email: string;
  role: string;
}
