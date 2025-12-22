"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IRole = exports.mentorApprovalStatus = void 0;
var mentorApprovalStatus;
(function (mentorApprovalStatus) {
    mentorApprovalStatus["PENDING"] = "pending";
    mentorApprovalStatus["APPROVED"] = "approved";
    mentorApprovalStatus["REJECTED"] = "rejected";
    mentorApprovalStatus["REQUESTED"] = "requested";
})(mentorApprovalStatus || (exports.mentorApprovalStatus = mentorApprovalStatus = {}));
var IRole;
(function (IRole) {
    IRole["Admin"] = "admin";
    IRole["Mentor"] = "mentor";
    IRole["Learner"] = "learner";
})(IRole || (exports.IRole = IRole = {}));
