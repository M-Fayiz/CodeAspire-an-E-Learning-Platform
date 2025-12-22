"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_error_1 = require("../../utils/http-error");
const http_status_const_1 = require("../../const/http-status.const");
const error_message_const_1 = require("../../const/error-message.const");
const user_types_1 = require("../../types/user.types");
const objectId_1 = require("../../mongoose/objectId");
const bcrypt_util_1 = require("../../utils/bcrypt.util");
const role_dto_1 = require("../../dtos/role.dto");
// import logger from "../../config/logger.config";
const notification_template_1 = require("../../template/notification.template");
class UserService {
    constructor(_userRepository, _mentorRepository, _notificationRepository) {
        this._userRepository = _userRepository;
        this._mentorRepository = _mentorRepository;
        this._notificationRepository = _notificationRepository;
    }
    async fetchUser(id) {
        const userId = (0, objectId_1.parseObjectId)(id);
        if (!userId) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.INVALID_ID);
        }
        const userData = await this._userRepository.getUserProfile(userId);
        if (!userData) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.USER_NOT_FOUND);
        }
        switch (userData.role) {
            case user_types_1.IRole.Admin:
                return userData;
            case user_types_1.IRole.Mentor:
                return userData;
            case user_types_1.IRole.Learner:
                return userData;
            default:
                return null;
        }
    }
    async changePassword(id, currentPassword, newPassword) {
        const objectId = (0, objectId_1.parseObjectId)(id);
        if (!objectId) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_CREDNTIALS);
        }
        const user = await this._userRepository.findUserById(objectId);
        if (!user) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.USER_NOT_FOUND);
        }
        const passwordIsMatch = await (0, bcrypt_util_1.comparePassword)(currentPassword, user.password);
        if (!passwordIsMatch) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.INVALID_CREDNTIALS);
        }
        const hashedPassword = await (0, bcrypt_util_1.hashPassword)(newPassword);
        await this._userRepository.updateUserPassword(user.email, hashedPassword);
        return true;
    }
    async userProfilePitcureUpdate(imageURL, userId) {
        const userObjectId = (0, objectId_1.parseObjectId)(userId);
        if (!userObjectId) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_CREDNTIALS);
        }
        const userData = await this._userRepository.userProfilePictureUpdate(userObjectId, imageURL);
        if (!userData || !userData.profilePicture) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.USER_NOT_FOUND);
        }
        return userData.profilePicture;
    }
    async updateUserProfile(id, userData) {
        const userId = (0, objectId_1.parseObjectId)(id);
        if (!userId) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_CREDNTIALS);
        }
        const user = await this._userRepository.findUserById(userId);
        if (!user) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.USER_NOT_FOUND);
        }
        const updateActions = {
            mentor: async () => {
                const result = await this._mentorRepository.updateMentorProfile(userId, userData);
                return result ? (0, role_dto_1.MentorDTO)(result) : null;
            },
            admin: async () => {
                const result = await this._userRepository.updateUserprofile(userId, userData);
                return result ? (0, role_dto_1.AdminDTO)(result) : null;
            },
            learner: async () => {
                const result = await this._userRepository.updateUserprofile(userId, userData);
                return result ? (0, role_dto_1.LearnerDTO)(result) : null;
            },
        };
        const handler = updateActions[user.role];
        if (!handler) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, `Invalid user role: ${user.role}`);
        }
        return handler();
    }
    async getUserProfile(userId) {
        const id = (0, objectId_1.parseObjectId)(userId);
        if (!id) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.INVALID_ID);
        }
        const userData = await this._userRepository.getUserProfile(id);
        if (userData?.role == user_types_1.IRole.Admin)
            return (0, role_dto_1.AdminDTO)(userData);
        if (userData?.role == user_types_1.IRole.Mentor)
            return (0, role_dto_1.MentorDTO)(userData);
        if (userData?.role == user_types_1.IRole.Learner)
            return (0, role_dto_1.LearnerDTO)(userData);
        return null;
    }
    async addMentorData(mentorId, mentorData) {
        const mentor_Id = (0, objectId_1.parseObjectId)(mentorId);
        if (!mentor_Id) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_ID);
        }
        const updateMentorData = await this._mentorRepository.updateMentorProfile(mentor_Id, { ...mentorData, ApprovalStatus: user_types_1.mentorApprovalStatus.REQUESTED });
        if (!updateMentorData) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.INTERNAL_SERVER_ERROR, error_message_const_1.HttpResponse.SERVER_ERROR);
        }
        const adminId = await this._userRepository.findUser({ role: user_types_1.IRole.Admin });
        const notificationData = notification_template_1.NotificationTemplates.mentorRequest(adminId._id, updateMentorData.name, updateMentorData._id);
        const NotificationData = await this._notificationRepository.createNotification(notificationData);
        return {
            MentorDtp: (0, role_dto_1.MentorDTO)(updateMentorData),
            notificationDTO: NotificationData,
        };
    }
}
exports.UserService = UserService;
