"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDTO = userDTO;
function userDTO(user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profilePicture,
        ApprovalStatus: user.ApprovalStatus,
        isRequested: user.isRequested,
    };
}
