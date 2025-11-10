import { ISlotModel } from "../models/slot.model";
import {
  ISlotDTO,
  ISlotPopulatedDTO,
  ISlotpopultedDataFromDB,
} from "../types/dtos.type/slots.dto.type";

export function slotDTO(slotData: ISlotModel): ISlotDTO {
  return {
    _id: slotData._id,
    mentorId: slotData.mentorId,
    courseId: slotData.courseId,
    selectedDays: slotData.selectedDays,
    slotDuration: slotData.slotDuration,
    isActive: slotData.isActive,
    pricePerSlot: slotData.pricePerSlot,
    startTime: slotData.startTime,
    endTime: slotData.endTime,
  };
}

export function slotPopulatedMapper(
  slotData: ISlotpopultedDataFromDB,
): ISlotPopulatedDTO {
  return {
    _id: slotData._id,
    course: slotData.courseId,
    endTime: slotData.endTime,
    startTime: slotData.startTime,
    mentor: slotData.mentorId,
    selectedDays: slotData.selectedDays,
    slotDuration: slotData.slotDuration,
    createdAt: slotData.createdAt,
    updatedAt: slotData.updatedAt,
  };
}
