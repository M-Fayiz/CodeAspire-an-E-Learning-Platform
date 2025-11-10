import type { mentorApprovalStatus } from "../users.type";

export interface IBaseRoleDTO {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: IRole;
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

export type IRole = "admin"| "mentor"| "learner"
