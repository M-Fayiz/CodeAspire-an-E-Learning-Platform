"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoSessionDTO = videoSessionDTO;
exports.ListBookedSlotOfLearner = ListBookedSlotOfLearner;
function videoSessionDTO(bookingData) {
    return {
        roomId: bookingData._id,
        mentorId: bookingData.mentorId,
        learnerId: bookingData.learnerId,
    };
}
function ListBookedSlotOfLearner(slot) {
    const options = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC",
    };
    const start = new Date(slot.startTime);
    const end = new Date(slot.endTime);
    const startTime = start.toLocaleTimeString("en-IN", options);
    const endTime = end.toLocaleTimeString("en-IN", options);
    return {
        _id: slot._id,
        slotId: slot.slotId,
        date: slot.date,
        startTime: startTime,
        endTime: endTime,
        type: slot.type,
        status: slot.status,
        feedback: slot.feedback,
        studentStatus: slot.studentStatus,
        courseId: {
            _id: slot.courseId._id,
            title: slot.courseId.title,
        },
        mentorId: {
            _id: slot.mentorId._id,
            name: slot.mentorId.name,
        },
        learnerId: {
            _id: slot.learnerId._id,
            name: slot.learnerId.name,
        },
    };
}
