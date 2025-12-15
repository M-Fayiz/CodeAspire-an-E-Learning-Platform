"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const http_status_1 = require("../../const/http-status");
const response_util_1 = require("../../utils/response.util");
const error_message_1 = require("../../const/error-message");
const socket_utils_1 = require("../../utils/socket.utils");
class AdminController {
    constructor(_adminService) {
        this._adminService = _adminService;
        this.fetchAllUsers = async (req, res, next) => {
            try {
                const page = Number(req.query.page) || 1;
                const name = req.query.name || "";
                const role = req.query.role || "";
                const rawIsActive = req.query.isActive || "";
                const isActive = rawIsActive === "true" ? true : rawIsActive === "false" ? false : "";
                const allUsers = await this._adminService.fetchAllUsers(Number(page), isActive, name, role);
                res.status(http_status_1.HttpStatus.OK).json((0, response_util_1.successResponse)(error_message_1.HttpResponse.OK, {
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
                    .status(http_status_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_1.HttpResponse.OK, { result }));
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
                    .status(http_status_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_1.HttpResponse.OK, { userData }));
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
                    .status(http_status_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_1.HttpResponse.OK, { status: approveStatus.status }));
            }
            catch (error) {
                next(error);
            }
        };
        this.getDashboardCardData = async (req, res, next) => {
            try {
                const dashBoardData = await this._adminService.getDashboardData();
                res
                    .status(http_status_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_1.HttpResponse.OK, { dashBoardData }));
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.AdminController = AdminController;
