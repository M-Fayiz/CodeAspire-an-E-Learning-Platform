import { Types } from "mongoose";
import { ISlotBookingModel } from "../models/sessionBooking.model";
import {
  IBookingDTOforLearner,
  IPopulatedBooking,
  IVideoSessionDTO,
} from "../types/dtos.type/slotBooking.dto.type";

export function videoSessionDTO(
  bookingData: ISlotBookingModel,
): IVideoSessionDTO {
  return {
    roomId: bookingData._id,
    mentorId: bookingData.mentorId,
    learnerId: bookingData.learnerId,
  };
}

export function ListBookedSlotOfLearner(
  slot: IPopulatedBooking,
): IBookingDTOforLearner {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
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
      _id: slot.courseId._id as Types.ObjectId,
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
