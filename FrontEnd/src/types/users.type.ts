import type { UserRole } from "./auth.types";

export interface IUserType {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  profilePicture?: string;
  bio?: string;
  isActive: boolean;
  createdAt?: Date | string;
  enrolledCourses?: string[];
  expertise?: string[];
  mentorRating?: number;
  imageURL?: string;
  approvalStatus?: mentorApprovalStatus;
  socialLinks?: {
    linkedIn: string;
    github: string;
    portfolio: string;
  };
  resume?: string;
}

export type mentorApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "requested";
export interface BaseUser {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  profilePicture?: string;
  phone?: string;
  bio?: string;
  role: "admin" | "mentor" | "learner";
}

export interface AdminUser extends BaseUser {
  role: "admin";
}

export interface LearnerUser extends BaseUser {
  role: "learner";
}

export interface MentorUser extends BaseUser {
  role: "mentor";
  rating: number;
  expertise: string[];
  ApprovalStatus: mentorApprovalStatus;
  isRequested: boolean;
  socialLinks: {
    linkedIn?: string;
    github?: string;
    portfolio?: string;
  };
  resume?: string;
}

export type AnyUser = AdminUser | LearnerUser | MentorUser;
