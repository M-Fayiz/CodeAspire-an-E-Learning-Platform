import { FilterQuery, PipelineStage, Types } from "mongoose";
import { ISlot, ISlotModel } from "../../models/slot.model";

import {

  createdUnPopulatedSlots,
  ISlotpopultedDataFromDB,
  mentorUnPopulatedSlots,
} from "../../types/dtos.type/slots.dto.type";

export interface ISlotRepository {
  createSlot(slotData: Partial<ISlot>): Promise<ISlotModel>;
  getMentorSLotsList(
    query: PipelineStage[],
  ): Promise<mentorUnPopulatedSlots[] | null>;
  getMentorSLots(
    mentorId: Types.ObjectId,
    populate?: string[],
  ): Promise<mentorUnPopulatedSlots[] | null>;
  getUpdateSlots(
    slotId: Types.ObjectId,
    populate?: string[],
  ): Promise<createdUnPopulatedSlots | null>;
  updateSlot(
    slotId: Types.ObjectId,
    slotData: ISlotModel,
  ): Promise<ISlotModel | null>;
  getCourseSlot(
    courseId: Types.ObjectId,
  ): Promise<ISlotpopultedDataFromDB | null>;
  findSlotByFilter(filter: FilterQuery<ISlotModel>): Promise<ISlotModel | null>;
  totalDocument(filter: FilterQuery<ISlotModel>): Promise<number>;
}
