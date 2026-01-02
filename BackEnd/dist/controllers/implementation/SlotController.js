"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotController = void 0;
const http_status_const_1 = require("../../const/http-status.const");
const response_util_1 = require("../../utils/response.util");
const error_message_const_1 = require("../../const/error-message.const");
class SlotController {
    constructor(_slotService) {
        this._slotService = _slotService;
        this.createSlot = async (req, res, next) => {
            try {
                const createdData = await this._slotService.createSlot(req.body);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { createdData }));
            }
            catch (error) {
                next(error);
            }
        };
        this.getMentorSlots = async (req, res, next) => {
            try {
                const { mentorId } = req.params;
                const { page, search, filter } = req.query;
                const mentorSlots = await this._slotService.getMontorSlots(mentorId, Number(page), search, filter);
                res.status(http_status_const_1.HttpStatus.OK).json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, {
                    mappedSlots: mentorSlots.mappedSlots,
                    totalPage: mentorSlots.totalDocument,
                }));
            }
            catch (error) {
                next(error);
            }
        };
        this.updateSlot = async (req, res, next) => {
            try {
                const { slotId } = req.params;
                const updatedSlot = await this._slotService.updateSlot(slotId, req.body);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { updatedSlot }));
            }
            catch (error) {
                next(error);
            }
        };
        this.getCourseSlot = async (req, res, next) => {
            try {
                const { courseId } = req.params;
                console.log("course id ", courseId);
                const slotData = await this._slotService.getCourseSlot(courseId);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { slotData }));
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.SlotController = SlotController;
