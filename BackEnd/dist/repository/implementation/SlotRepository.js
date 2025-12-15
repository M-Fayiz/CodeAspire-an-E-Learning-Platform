"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotRepository = void 0;
const slot_model_1 = require("../../models/slot.model");
const baseRepository_1 = require("../baseRepository");
class SlotRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(slot_model_1.SlotModel);
    }
    async createSlot(slotData) {
        return await this.create(slotData);
    }
    async getMentorSLots(mentorId, populate) {
        return await this.find({ mentorId: mentorId }, populate);
    }
    async updateSlot(slotId, slotData) {
        return await this.findByIDAndUpdate(slotId, slotData);
    }
    async getCourseSlot(courseId) {
        return await this.findOne({ courseId }, [
            "courseId",
            "mentorId",
        ]);
    }
    async findSlotByFilter(filter) {
        return await this.findOne(filter);
    }
}
exports.SlotRepository = SlotRepository;
