import { FilterQuery, Types } from "mongoose";
import { ISlotModel } from "../../models/slot.model";
import { slotDays } from "../../types/slot.type";
import {  ISlotpopultedDataFromDB } from "../../types/dtos.type/slots.dto.type";

export interface ISlotRepository {
  createSlot(slotData: Partial<ISlotModel>): Promise<ISlotModel>;
  getMentorSLots(mentorId: Types.ObjectId): Promise<ISlotModel[] | null>;
  findSlot(
    mentorId: Types.ObjectId,
    selectedDays: slotDays[],
    startTime: string,
    endTime: string,
    excludeSlotId?: Types.ObjectId,
  ): Promise<ISlotModel | null>;
  updateSlot(
    slotId: Types.ObjectId,
    slotData: ISlotModel,
  ): Promise<ISlotModel | null>;
  getCourseSlot(courseId: Types.ObjectId): Promise<ISlotpopultedDataFromDB | null>;
  findSlotByFilter(filter: FilterQuery<ISlotModel>): Promise<ISlotModel | null>;
}
