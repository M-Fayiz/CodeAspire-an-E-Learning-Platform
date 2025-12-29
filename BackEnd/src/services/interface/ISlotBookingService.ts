import Stripe from "stripe";
import {
  BookingStatus,
  ISlotBooking,
  StudenStatus,
} from "../../types/sessionBooking.type";
import {
  IBookingDTOforLearner,
  IVideoSessionDTO,
} from "../../types/dtos.type/slotBooking.dto.type";
import { Types } from "mongoose";

import { INotificationDTO } from "../../types/dtos.type/notification.dto.types";

export interface ISlotBookingService {
  createBooking(bookingData: ISlotBooking): Promise<string | null>;
  handleSlotBooking(session: Stripe.Checkout.Session): Promise<void>;
  findBookedSlot(bookedId: string): Promise<{
    sesionData: IVideoSessionDTO;
    createdMentorNotify: INotificationDTO;
    createdLearnerNotify: INotificationDTO;
  }>;
  ListLearnerBookedSlots(
    learnerId?: string,
    mentorId?: string,
    page?: number,
  ): Promise<IBookingDTOforLearner[]>;
  addFeedback(
    bookedId: string,
    feedBack: string,
  ): Promise<{ feedback: string; bookedId: Types.ObjectId }>;
  getBookedSlots(date: Date): Promise<Types.ObjectId[]>;
  updateStudents(
    bookedId: string,
    status: StudenStatus,
  ): Promise<{ bookedId: Types.ObjectId; status: StudenStatus }>;
  updateSlotStatus(
    bookedId: string,
    status: BookingStatus,
  ): Promise<{ bookedId: Types.ObjectId; status: BookingStatus }>;
  cancelSlot(
    bookedId: string,
  ): Promise<{ status: BookingStatus; notification: INotificationDTO }>;
}
