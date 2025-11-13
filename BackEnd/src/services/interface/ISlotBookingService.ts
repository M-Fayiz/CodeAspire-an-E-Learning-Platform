import Stripe from "stripe";
import { ISlotBooking } from "../../types/sessionBooking.type";
import {
  IBookingDTOforLearner,
  IVideoSessionDTO,
} from "../../types/dtos.type/slotBooking.dto.type";
import { Types } from "mongoose";

export interface ISlotBookingService {
  createBooking(bookingData: ISlotBooking): Promise<string | null>;
  handleSlotBooking(session: Stripe.Checkout.Session): Promise<void>;
  findBookedSlot(bookedId: string): Promise<IVideoSessionDTO>;
  ListLearnerBookedSlots(
    learnerId?: string,
    mentorId?: string,
    page?: number,
  ): Promise<IBookingDTOforLearner[]>;
  addFeedback(
    bookedId: string,
    feedBack: string,
  ): Promise<{ feedback: string; bookedId: Types.ObjectId }>;
}
