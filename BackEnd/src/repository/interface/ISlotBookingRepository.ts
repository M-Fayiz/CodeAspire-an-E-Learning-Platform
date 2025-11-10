import { FilterQuery, Types, UpdateQuery } from "mongoose";
import { ISlotBookingModel } from "../../models/sessionBooking.model";
import { ISlotBooking } from "../../types/sessionBooking.type";

export interface ISlotBookingRepository {
  createBooking(bookingData: Partial<ISlotBooking>): Promise<ISlotBookingModel>;
  findBooking(
    learnerId: Types.ObjectId,
    courseId: Types.ObjectId,
  ): Promise<ISlotBookingModel | null>;
  findSlots(
    quesry: FilterQuery<ISlotBooking>,
  ): Promise<ISlotBookingModel | null>;
  findAllSlots(
    query: FilterQuery<ISlotBooking>,
  ): Promise<ISlotBookingModel[] | null>;
  updateSlotBookingData(
    filter: FilterQuery<ISlotBookingModel>,
    data: UpdateQuery<ISlotBookingModel>,
  ): Promise<ISlotBookingModel | null>;
}
