import { FilterQuery, PipelineStage, Types } from "mongoose";
import { ISlotModel, SlotModel } from "../../models/slot.model";
import { BaseRepository } from "../baseRepository";
import { ISlotRepository } from "../interface/ISlotRepository";

import {
  createdUnPopulatedSlots,
  ISlotpopultedDataFromDB,
  mentorUnPopulatedSlots,
} from "../../types/dtos.type/slots.dto.type";

export class SlotRepository
  extends BaseRepository<ISlotModel>
  implements ISlotRepository
{
  constructor() {
    super(SlotModel);
  }

  async createSlot(slotData: Partial<ISlotModel>): Promise<ISlotModel> {
    return await this.create(slotData);
  }
  async getMentorSLots(
    mentorId: Types.ObjectId,

    populate?: string[],
  ): Promise<mentorUnPopulatedSlots[] | null> {
    return await this.find({ mentorId: mentorId }, populate);
  }
  async updateSlot(
    slotId: Types.ObjectId,
    slotData: ISlotModel,
  ): Promise<ISlotModel | null> {
    return await this.findByIDAndUpdate(slotId, slotData);
  }
  async getCourseSlot(
    courseId: Types.ObjectId,
  ): Promise<ISlotpopultedDataFromDB | null> {
    return await this.findOne<ISlotpopultedDataFromDB>({ courseId }, [
      "courseId",
      "mentorId",
    ]);
  }
  async findSlotByFilter(
    filter: FilterQuery<ISlotModel>,
  ): Promise<ISlotModel | null> {
    return await this.findOne(filter);
  }
  async totalDocument(filter: FilterQuery<ISlotModel>): Promise<number> {
    return await this.countDocuments(filter);
  }
  async getMentorSLotsList(
    query: PipelineStage[],
  ): Promise<mentorUnPopulatedSlots[] | null> {
    return await this.aggregate(query);
  }
  async getUpdateSlots(
    slotId: Types.ObjectId,
    populate?: string[],
  ): Promise<createdUnPopulatedSlots | null> {
    return await this.findOne({ _id: slotId }, populate);
  }
}
