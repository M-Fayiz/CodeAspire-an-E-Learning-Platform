"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotBookingController = void 0;
const http_status_const_1 = require("../../const/http-status.const");
const error_message_const_1 = require("../../const/error-message.const");
const response_util_1 = require("../../utils/response.util");
const socket_utils_1 = require("../../utils/socket.utils");
class SlotBookingController {
    constructor(_slotBookingService) {
        this._slotBookingService = _slotBookingService;
        this.createBooking = async (req, res, next) => {
            try {
                const { learnerId, slotId, date, courseId, startTime, endTime, mentorId, } = req.body;
                const bookingData = {
                    mentorId,
                    learnerId,
                    courseId,
                    slotId,
                    date,
                    startTime,
                    endTime,
                };
                const checkoutURL = await this._slotBookingService.createBooking(bookingData);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { checkoutURL }));
            }
            catch (error) {
                next(error);
            }
        };
        this.listBookedSlot = async (req, res, next) => {
            try {
                const { learnerId } = req.params;
                const listsOfBooked = await this._slotBookingService.ListLearnerBookedSlots(learnerId);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { listsOfBooked }));
            }
            catch (error) {
                next(error);
            }
        };
        this.listBookedSlotOnMentor = async (req, res, next) => {
            try {
                const { mentorId } = req.params;
                const listsOfBooked = await this._slotBookingService.ListLearnerBookedSlots(undefined, mentorId);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { listsOfBooked }));
            }
            catch (error) {
                next(error);
            }
        };
        this.addFeedBack = async (req, res, next) => {
            try {
                const { bookedId } = req.params;
                const { feedback } = req.body;
                const updatedFeedback = await this._slotBookingService.addFeedback(bookedId, feedback);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { updatedFeedback }));
            }
            catch (error) {
                next(error);
            }
        };
        this.getBookedSlots = async (req, res, next) => {
            try {
                const date = new Date();
                const bookedSlots = await this._slotBookingService.getBookedSlots(date);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { bookedSlots }));
            }
            catch (error) {
                next(error);
            }
        };
        this.updateStudentStatus = async (req, res, next) => {
            try {
                const { bookedId } = req.params;
                const { studentStatus } = req.body;
                const updatedData = await this._slotBookingService.updateStudents(bookedId, studentStatus);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { updatedData }));
            }
            catch (error) {
                next(error);
            }
        };
        this.updateSlotStatus = async (req, res, next) => {
            try {
                const { bookedId } = req.params;
                const { status } = req.body;
                const updateStatus = await this._slotBookingService.updateSlotStatus(bookedId, status);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { updateStatus }));
            }
            catch (error) {
                next(error);
            }
        };
        this.cancelBookedSLot = async (req, res, next) => {
            try {
                const { bookedId } = req.params;
                const { notification, status } = await this._slotBookingService.cancelSlot(bookedId);
                (0, socket_utils_1.sendNotification)(notification.userId, notification);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { status }));
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.SlotBookingController = SlotBookingController;
