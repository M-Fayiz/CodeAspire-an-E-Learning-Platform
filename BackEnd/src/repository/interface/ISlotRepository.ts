import { FilterQuery, Types } from "mongoose";
import { ISlotModel } from "../../models/slot.model";
import { SlotDay } from "../../types/slot.type";
import {
  ISlotpopultedDataFromDB,
  mentorUnPopulatedSlots,
} from "../../types/dtos.type/slots.dto.type";

export interface ISlotRepository {
  createSlot(slotData: Partial<ISlotModel>): Promise<ISlotModel>;
  getMentorSLots(
    mentorId: Types.ObjectId,
    populate?: string[],
  ): Promise<mentorUnPopulatedSlots[] | null>;

  updateSlot(
    slotId: Types.ObjectId,
    slotData: ISlotModel,
  ): Promise<ISlotModel | null>;
  getCourseSlot(
    courseId: Types.ObjectId,
  ): Promise<ISlotpopultedDataFromDB | null>;
  findSlotByFilter(filter: FilterQuery<ISlotModel>): Promise<ISlotModel | null>;
}
