"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorDTO = MentorDTO;
exports.LearnerDTO = LearnerDTO;
exports.AdminDTO = AdminDTO;
function MentorDTO(mentor) {
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
function LearnerDTO(learner) {
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
    };
}
function AdminDTO(admin) {
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
