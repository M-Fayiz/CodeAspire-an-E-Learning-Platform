"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const http_status_const_1 = require("../../const/http-status.const");
const response_util_1 = require("../../utils/response.util");
const error_message_const_1 = require("../../const/error-message.const");
const socket_utils_1 = require("../../utils/socket.utils");
class AdminController {
    constructor(_adminService) {
        this._adminService = _adminService;
        this.fetchAllUsers = async (req, res, next) => {
            try {
                const { page, search } = req.query;
                const allUsers = await this._adminService.fetchAllUsers(Number(page), search);
                res.status(http_status_const_1.HttpStatus.OK).json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, {
                    users: allUsers.safeUsers,
                    totalPage: allUsers.totalPage,
                }));
            }
            catch (error) {
                next(error);
            }
        };
        /**
         *
         * @param req
         * @param res
         * @param next
         */
        this.blockUser = async (req, res, next) => {
            try {
                const user_ID = req.params.userId;
                const result = await this._adminService.blockUser(user_ID);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { result }));
            }
            catch (error) {
                next(error);
            }
        };
        this.userProfile = async (req, res, next) => {
            try {
                const { userId } = req.params;
                console.log("userID : ", userId);
                const userData = await this._adminService.userProfile(userId);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { userData }));
            }
            catch (error) {
                next(error);
            }
        };
        this.approveMentor = async (req, res, next) => {
            try {
                const { userId } = req.params;
                const { status, feedback } = req.body;
                const approveStatus = await this._adminService.approveMentor(userId, status, feedback);
                (0, socket_utils_1.sendNotification)(approveStatus.notification.userId, approveStatus.notification);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { status: approveStatus.status }));
            }
            catch (error) {
                next(error);
            }
        };
        this.getDashboardCardData = async (req, res, next) => {
            try {
                const { filter, startDate, endDate } = req.query;
                const dashBoardData = await this._adminService.getDashboardData(filter, startDate, endDate);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { dashBoardData }));
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.AdminController = AdminController;
