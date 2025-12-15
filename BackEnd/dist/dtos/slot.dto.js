"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slotDTO = slotDTO;
exports.slotPopulatedMapper = slotPopulatedMapper;
exports.mentorSlotsDTO = mentorSlotsDTO;
function slotDTO(slotData, courseName) {
    return {
        _id: slotData._id,
        mentorId: slotData.mentorId,
        course: {
            _id: slotData.courseId,
            title: courseName,
        },
        selectedDays: slotData.selectedDays,
        slotDuration: slotData.slotDuration,
        pricePerSlot: slotData.pricePerSlot,
        isActive: slotData.isActive,
    };
}
function slotPopulatedMapper(slotData) {
    return {
        _id: slotData._id,
        course: slotData.courseId,
        mentor: slotData.mentorId,
        selectedDays: slotData.selectedDays,
        slotDuration: slotData.slotDuration,
        createdAt: slotData.createdAt,
        updatedAt: slotData.updatedAt,
    };
}
function mentorSlotsDTO(slotData) {
    return {
        _id: slotData._id,
        course: {
            _id: slotData.courseId._id,
            title: slotData.courseId.title,
        },
        mentorId: slotData.mentorId,
        selectedDays: slotData.selectedDays,
        slotDuration: slotData.slotDuration,
        pricePerSlot: slotData.pricePerSlot,
        isActive: slotData.isActive,
        createdAt: slotData.createdAt,
        updatedAt: slotData.updatedAt,
    };
}
