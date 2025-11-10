import { FilterQuery, Types } from "mongoose";
import {
  ISlotBookingModel,
  SlotBookingModel,
} from "../../models/sessionBooking.model";
import { ISlotBooking } from "../../types/sessionBooking.type";
import { BaseRepository } from "../baseRepository";
import { ISlotBookingRepository } from "../interface/ISlotBookingRepository";

export class SlotBookingRepository
  extends BaseRepository<ISlotBookingModel>
  implements ISlotBookingRepository
{
  constructor() {
    super(SlotBookingModel);
  }

  async createBooking(
    bookingData: Partial<ISlotBooking>,
  ): Promise<ISlotBookingModel> {
    return await this.create(bookingData);
  }

  async findBooking(
    learnerId: Types.ObjectId,
    courseId: Types.ObjectId,
  ): Promise<ISlotBookingModel | null> {
    return await this.findOne({ learnerId, courseId });
  }

  async findSlots(
    quesry: FilterQuery<ISlotBooking>,
  ): Promise<ISlotBookingModel | null> {
    return await this.findOne(quesry);
  }

  async findAllSlots(
    query: FilterQuery<ISlotBooking>,
  ): Promise<ISlotBookingModel[] | null> {
    return await this.find(query);
  }
}
