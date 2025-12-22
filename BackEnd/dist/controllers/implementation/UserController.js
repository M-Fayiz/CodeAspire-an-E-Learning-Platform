"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const http_status_const_1 = require("../../const/http-status.const");
const response_util_1 = require("../../utils/response.util");
const error_message_const_1 = require("../../const/error-message.const");
const socket_utils_1 = require("../../utils/socket.utils");
class UserController {
    constructor(_userService) {
        this._userService = _userService;
        this.fetchProfile = async (req, res, next) => {
            try {
                const { userId } = req.params;
                // logger.info('user logged controler',{id})
                const userData = await this._userService.fetchUser(userId);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { userData }));
            }
            catch (error) {
                next(error);
            }
        };
        this.changePassword = async (req, res, next) => {
            try {
                const { currentPassword, newPassword } = req.body;
                const { userId } = req.params;
                await this._userService.changePassword(userId, currentPassword, newPassword);
                res.status(http_status_const_1.HttpStatus.OK).json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { changed: true }));
            }
            catch (error) {
                next(error);
            }
        };
        this.updateProfileImage = async (req, res, next) => {
            try {
                const { imageURL } = req.body;
                const { userId } = req.params;
                const ImageSavedUrl = await this._userService.userProfilePitcureUpdate(imageURL, userId);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { imgURL: ImageSavedUrl }));
            }
            catch (error) {
                next(error);
            }
        };
        this.updateUserProfile = async (req, res, next) => {
            try {
                const { userId } = req.params;
                const updatedData = await this._userService.updateUserProfile(userId, req.body);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { updatedData: updatedData }));
            }
            catch (error) {
                next(error);
            }
        };
        this.getUserProfile = async (req, res, next) => {
            try {
                const { userId } = req.params;
                const userData = await this._userService.getUserProfile(userId);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { userData }));
            }
            catch (error) {
                next(error);
            }
        };
        this.addMentorData = async (req, res, next) => {
            try {
                const { mentorId } = req.params;
                const userData = req.body;
                console.log("user data :", req.body);
                const mentorDataAndNotify = await this._userService.addMentorData(mentorId, userData);
                (0, socket_utils_1.sendNotification)(mentorDataAndNotify.notificationDTO.userId, mentorDataAndNotify.notificationDTO);
                res.status(http_status_const_1.HttpStatus.OK).json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, {
                    mentorData: mentorDataAndNotify.MentorDtp,
                }));
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.UserController = UserController;
