"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotService = void 0;
const error_message_1 = require("../../const/error-message");
const http_status_1 = require("../../const/http-status");
const slot_dto_1 = require("../../dtos/slot.dto");
const objectId_1 = require("../../mongoose/objectId");
const http_error_1 = require("../../utils/http-error");
const timeManagement_util_1 = require("../../utils/timeManagement.util");
class SlotService {
    constructor(_slotRepository, _slotBookingRepository, _courseRepositoy) {
        this._slotRepository = _slotRepository;
        this._slotBookingRepository = _slotBookingRepository;
        this._courseRepositoy = _courseRepositoy;
    }
    /**
     * check if there are any course exist in same mentor , same days , same time line, if there is not create new slot
     * @param slotData
     * @returns created slot document from the DB
     */
    async createSlot(slotData) {
        console.log(slotData);
        const isCourseSLotExist = await this._slotRepository.findSlotByFilter({
            courseId: slotData.courseId,
        });
        if (isCourseSLotExist) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.CONFLICT, error_message_1.HttpResponse.SLOT_EXIST);
        }
        const existingSlots = await this._slotRepository.getMentorSLots(slotData.mentorId);
        if (existingSlots) {
            for (const newDay of slotData.selectedDays) {
                if (!newDay.active)
                    continue;
                const newStart = newDay.startTime;
                const newEnd = newDay.endTime;
                for (const existingSlot of existingSlots) {
                    for (const existingDay of existingSlot.selectedDays) {
                        if (!existingDay.active)
                            continue;
                        if (existingDay.day !== newDay.day)
                            continue;
                        const existingStart = existingDay.startTime;
                        const existingEnd = existingDay.endTime;
                        const overlap = newStart < existingEnd && newEnd > existingStart;
                        if (overlap) {
                            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.CONFLICT, error_message_1.HttpResponse.SLOT_EXIST_DAYS(newDay.day, `${existingDay.startTime} - ${existingDay.endTime}`));
                        }
                    }
                }
            }
        }
        const createdSlot = await this._slotRepository.createSlot(slotData);
        const courseName = await this._courseRepositoy.findCourse(createdSlot.courseId);
        return (0, slot_dto_1.slotDTO)(createdSlot, courseName?.title);
    }
    /**
     * fetch mentor's slot data
     * @param mentorId
     * @returns array of mapped slot data
     */
    async getMontorSlots(mentorId) {
        const mentor_Id = (0, objectId_1.parseObjectId)(mentorId);
        if (!mentor_Id) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.NOT_FOUND, error_message_1.HttpResponse.INVALID_ID);
        }
        const mentorSlots = await this._slotRepository.getMentorSLots(mentor_Id, [
            "courseId",
        ]);
        if (!mentorSlots) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.NOT_FOUND, error_message_1.HttpResponse.ITEM_NOT_FOUND);
        }
        for (let daySlots of mentorSlots) {
            for (let days of daySlots.selectedDays) {
                days.startTime = (0, timeManagement_util_1.convertTo12Hour)(days.startTime);
                days.endTime = (0, timeManagement_util_1.convertTo12Hour)(days.endTime);
            }
        }
        return mentorSlots?.map((slot) => (0, slot_dto_1.mentorSlotsDTO)(slot));
    }
    /**
     * Updates a mentor's slot and validates whether any other slot
     * exists for the same mentor on the same days and within the same time range,
     * excluding the current slot being updated.
     * @param slotId
     * @param slotData
     * @returns updated slot after mapping
     */
    async updateSlot(slotId, slotData) {
        const slot_Id = (0, objectId_1.parseObjectId)(slotId);
        if (!slot_Id) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.BAD_REQUEST, error_message_1.HttpResponse.INVALID_ID);
        }
        const existingSlots = await this._slotRepository.getMentorSLots(slotData.mentorId);
        if (existingSlots) {
            for (const newDay of slotData.selectedDays) {
                if (!newDay.active)
                    continue;
                const newStart = newDay.startTime;
                const newEnd = newDay.endTime;
                for (const existingSlot of existingSlots) {
                    if (existingSlot._id.toString() === slot_Id.toString())
                        continue;
                    for (const existingDay of existingSlot.selectedDays) {
                        if (!existingDay.active)
                            continue;
                        if (existingDay.day !== newDay.day)
                            continue;
                        const existingStart = existingDay.startTime;
                        const existingEnd = existingDay.endTime;
                        const overlap = newStart < existingEnd && newEnd > existingStart;
                        if (overlap) {
                            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.CONFLICT, error_message_1.HttpResponse.SLOT_EXIST_DAYS(newDay.day, `${existingDay.startTime} - ${existingDay.endTime}`));
                        }
                    }
                }
            }
        }
        const updatedSlot = await this._slotRepository.updateSlot(slot_Id, slotData);
        if (!updatedSlot) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.NOT_FOUND, error_message_1.HttpResponse.ITEM_NOT_FOUND);
        }
        const courseName = await this._courseRepositoy.findCourse(updatedSlot.courseId);
        if (!courseName) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.NOT_FOUND, error_message_1.HttpResponse.COURSE_NOT_FOUND);
        }
        return (0, slot_dto_1.slotDTO)(updatedSlot, courseName.title);
    }
    /**
     * Fetch a mentor slot by its course ID.
     *
     * @param courseId - The course ID as a string.
     * @returns The mapped slot data including mentor and course details.
     * @throws {HttpError} If the course ID is invalid or no slot is found.
     */
    async getCourseSlot(courseId) {
        const course_Id = (0, objectId_1.parseObjectId)(courseId);
        if (!course_Id) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.BAD_REQUEST, error_message_1.HttpResponse.INVALID_ID);
        }
        const slotDAta = await this._slotRepository.getCourseSlot(course_Id);
        if (!slotDAta) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.NOT_FOUND, error_message_1.HttpResponse.ITEM_NOT_FOUND);
        }
        await this._slotBookingRepository.findAllSlots({
            courseId: course_Id,
            status: "booked",
        });
        for (let days of slotDAta.selectedDays) {
            days.startTime = (0, timeManagement_util_1.convertTo12Hour)(days.startTime);
            days.endTime = (0, timeManagement_util_1.convertTo12Hour)(days.endTime);
        }
        const AvtivSlot = slotDAta.selectedDays.filter((day) => day.active);
        return (0, slot_dto_1.slotPopulatedMapper)({ ...slotDAta, selectedDays: AvtivSlot });
    }
}
exports.SlotService = SlotService;
