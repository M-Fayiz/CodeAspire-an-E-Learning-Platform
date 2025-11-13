import { Types } from "mongoose";
import { ISlotModel } from "../models/slot.model";
import {
  ISlotDTO,
  ISlotPopulatedDTO,
  ISlotpopultedDataFromDB,
  mentorUnPopulatedSlots,
} from "../types/dtos.type/slots.dto.type";

export function slotDTO(slotData: ISlotModel): ISlotDTO {
  return {
    _id: slotData._id,
    mentorId: slotData.mentorId,
    courseId: slotData.courseId,
    selectedDays: slotData.selectedDays,
    slotDuration: slotData.slotDuration,
    pricePerSlot: slotData.pricePerSlot,
    isActive: slotData.isActive,
  };
}

export function slotPopulatedMapper(
  slotData: ISlotpopultedDataFromDB,
): ISlotPopulatedDTO {
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

export function mentorSlotsDTO(slotData: mentorUnPopulatedSlots): ISlotDTO {
  return {
    _id: slotData._id,
    courseId: slotData.courseId._id as Types.ObjectId,
    mentorId: slotData.mentorId,
    selectedDays: slotData.selectedDays,
    slotDuration: slotData.slotDuration,
    pricePerSlot: slotData.pricePerSlot,
    isActive: slotData.isActive,
    createdAt: slotData.createdAt,
    updatedAt: slotData.updatedAt,
  };
}
