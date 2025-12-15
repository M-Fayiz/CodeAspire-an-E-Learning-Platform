"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotBookingRepository = void 0;
const sessionBooking_model_1 = require("../../models/sessionBooking.model");
const baseRepository_1 = require("../baseRepository");
class SlotBookingRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(sessionBooking_model_1.SlotBookingModel);
    }
    async createBooking(bookingData) {
        return await this.create(bookingData);
    }
    async findBooking(learnerId, courseId) {
        return await this.findOne({ learnerId, courseId });
    }
    async findSlots(quesry) {
        return await this.findOne(quesry);
    }
    async findAllSlots(query) {
        return await this.find(query);
    }
    async updateSlotBookingData(filter, data) {
        return await this.findOneAndUpdate(filter, data);
    }
    async listbookedSlots(filter, limit, skip) {
        return await this.findAll(filter, limit, skip, ["learnerId", "courseId", "mentorId"], true);
    }
}
exports.SlotBookingRepository = SlotBookingRepository;
