import { IAdminModel, ILearnerModel, IMenterModel } from "../models/user.model";
import {
  IAdminDTO,
  ILearnerDTO,
  IMentorDTO,
} from "../types/dtos.type/user.dto.types";

export function MentorDTO(mentor: IMenterModel): IMentorDTO {
  return {
    id: mentor._id,
    name: mentor.name,
    email: mentor.email,
    role: mentor.role,
    phone: mentor.phone,
    profilePicture: mentor.profilePicture,
    isActive: mentor.isActive,
    expertise: mentor.expertise,
    bio: mentor.bio,
    socialLinks: mentor.socialLinks,
    resume: mentor.resume,
    ApprovalStatus: mentor.ApprovalStatus,
    isRequested: mentor.isRequested,
  };
}

export function LearnerDTO(learner: ILearnerModel): ILearnerDTO {
  return {
    id: learner._id,
    name: learner.name,
    email: learner.email,
    role: learner.role,
    phone: learner.phone,
    profilePicture: learner.profilePicture,
    isActive: learner.isActive,
    bio: learner.bio,
    ApprovalStatus: learner.ApprovalStatus,
    enrolledCourses: learner.enrolledCourses,
  };
}

export function AdminDTO(admin: IAdminModel): IAdminDTO {
  return {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    phone: admin.phone,
    profilePicture: admin.profilePicture,
    isActive: admin.isActive,
    bio: admin.bio,
    ApprovalStatus: admin.ApprovalStatus,
  };
}
