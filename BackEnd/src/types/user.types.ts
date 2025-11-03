import { Types } from "mongoose";

export type mentorApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "requested";
export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string;
  googleId?: string;
  role: IRole;
  profilePicture?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: DataTransfer;
  bio?: string;
  ApprovalStatus: mentorApprovalStatus;
  isRequested: boolean;
}

export interface IMentor extends IUser {
  role: IRole.Mentor;
  expertise: string[];
  bio: string;
  rating: number;
  socialLinks: {
    linkedIn?: string;
    github?: string;
    portfolio?: string;
  };
  resume?: string;
}

export interface ILearner extends IUser {
  role: IRole.Learner;
  enrolledCourses: Types.ObjectId[];
}

export interface IAdmin extends IUser {
  role: IRole.Admin;
}

export interface IAuth {
  email: string;
  token: string;
}

export type IAnyUser = IUser | IAdmin | ILearner | IMentor;

export interface searchProps {
  name: string | "";
  role: IRole | "";
  isActive: boolean | "";
}

export enum IRole {
  Admin = "admin",
  Mentor = "mentor",
  Learner = "learner",
}
